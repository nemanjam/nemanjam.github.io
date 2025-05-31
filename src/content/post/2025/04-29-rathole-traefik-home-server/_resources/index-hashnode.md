## Introduction

In the previous article, I wrote about a temporary SSH tunneling technique to bypass CGNAT. This method is not suitable for exposing permanent services, at least not without `autossh` manager. Proper tools for this are [rapiz1/rathole](https://github.com/rapiz1/rathole) or [fatedier/frp](https://github.com/fatedier/frp). I chose Rathole since it's written in Rust and offers better performance and benchmarks.

## Prerequisites

- A VPS server with a public IP and Docker, ideally small, you can't use ports `80` and `443` for any other services aside from Rathole
- A home server
- A domain name

## Architecture overview

We will use Rathole for an encrypted tunnel between the VPS and the local network. We will also use Traefik since we want to host multiple websites on our home server, just like you would on any server.

The main question is where to run Traefik:

1. On the VPS
2. On the home server

I highly prefer option 2 because, that way, the entire configuration is stored on our home server. The home server is almost tunnel-agnostic, and you can reuse it on any tunneled or non-tunneled server. Otherwise, we would need to maintain state between the VPS and the home server, debug both together, etc.

Another point is that, with option 2, we avoid the gap of unencrypted traffic on the VPS between Traefik (TLS) and Rathole (Noise Protocol). You can read more about the comparison of these two options in this article: https://blog.mni.li/posts/caddy-rathole-zero-knowledge/.

The downside is that Rathole will exclusively occupy ports `80` and `443` on the VPS, preventing any other process from using them. We won't be able to run other web servers on that VPS, so it's best to use a small one dedicated to this purpose.

Unless we use a load balancer [Load balancing multiple Rathole tunnels with Traefik HTTP and TCP routers](https://nemanjamitic.com/blog/2025-05-29-traefik-load-balancer).

![Rathole Traefik architecture diagram](https://cdn.hashnode.com/res/hashnode/image/upload/v1746081593116/c38bd46b-e179-468c-9180-d587506b348b.png align="center")

## Rathole server

We will run the Rathole server inside a Docker container on our VPS. Rathole uses the same binary for both the server and client, you just pass the right option (`--server` or `--client`) and the `.toml` configuration file.

Here is the Rathole server configuration [rathole.server.toml](https://github.com/nemanjam/rathole-server/blob/5226ff53992abe930302098677a570151ebff927/rathole.server.toml):

```toml
# rathole.server.toml

[server]
bind_addr = "0.0.0.0:2333"

[server.transport]
type = "noise"

[server.transport.noise]
local_private_key = "private_key"

[server.services.traefik-http]
token = "secret_token_1"
bind_addr = "0.0.0.0:5080"

[server.services.traefik-https]
token = "secret_token_1"
bind_addr = "0.0.0.0:5443"
```

Let's explain it: we choose port `2333` for the control channel and bind it to all interfaces inside the Docker container with the `0.0.0.0` IP. We choose the `noise` encryption protocol and specify a private key. The public key will be used on the Rathole client. The public and private key pair is generated with:

```bash
docker run -it --rm rapiz1/rathole --genkey
```

Then we define two tunnels: one for HTTP and another for HTTPS. For the HTTP tunnel, we define the name `server.services.traefik-http`, set the value for `token`, and choose port `5080`, and again we bind it to all container interfaces with `0.0.0.0`. Similarly, for HTTPS, we set the name to `server.services.traefik-https`, provide a `token` value, and choose port `5443`.

Every tunnel has to have a unique name, token value, and port. With that fulfilled, a single Rathole server instance can have as many Rathole clients as needed, which is pretty convenient. For example, besides the existing home server on ports `5080` and `5443`, we can expose another one using ports `5081` and `5444`.

Token is just a random base64 string, we generate it by running this:

```bash
openssl rand -base64 32
```

After configuration file we define a Rathole server container with [docker-compose.yml](https://github.com/nemanjam/rathole-server/blob/5226ff53992abe930302098677a570151ebff927/docker-compose.yml):

```yml
# docker-compose.yml

services:
  rathole:
    image: rapiz1/rathole:v0.5.0
    container_name: rathole
    command: --server /config/rathole.server.toml
    restart: unless-stopped
    ports:
      # host:container
      - 2333:2333
      - 80:5080
      - 443:5443
    volumes:
      - ./rathole.server.toml:/config/rathole.server.toml:ro
```

In the command, we set the `--server` option, pass the `.toml` configuration file, and mount it as a read-only bind-mount volume.

The important part is the port mappings. Here, you can see that the Rathole server container will occupy ports `2333`, `80`, and `443` exclusively on the host VPS. This practically means we won't be able to run any other web servers on ports `80` and `443`. We will also need to open ports `80`, `443`, and `2333` in the VPS firewall. You don't need to open ports `5080` and `5443`, those are used only by Rathole internally.

## Rathole client and connecting with Traefik

We run the Rathole client and Traefik inside Docker containers on the home server. Configuring the Rathole client and connecting it to Traefik is a bit more complex and tricky.

Here is the Rathole client configuration [core/rathole.client.toml.example](https://github.com/nemanjam/traefik-proxy/blob/e8fece09e31ec99ddd21559f343d0ddea9fb55bf/core/rathole.client.toml.example):

```toml
# core/rathole.client.toml.example

[client]
remote_addr = "123.123.123.123:2333"

[client.transport]
type = "noise"

[client.transport.noise]
remote_public_key = "public_key"

# this is the important part
# Rathole knows traffic comes from 5080 and 5443, control channel told him
# DON'T do ANY mapping in docker-compose.yml
# just pass traffic from Rathole on ports which Traefik expects (80 and 443)

[client.services.traefik-http]
token = "secret_token_1"
local_addr = "traefik:80"

[client.services.traefik-https]
token = "secret_token_1"
local_addr = "traefik:443"
```

Let's go through it. First, we define the VPS server IP `remote_addr`, the control channel port `2333`, set the `noise` encryption protocol, and this time specify a public key `remote_public_key`.

Now comes the important and tricky part: defining tunnels and services. We repeat the service name and token that we used in the Rathole server config.

**And now the most important part:** `local_addr`, for this we target the Traefik hostname - service name from `core/docker-compose.local.yml` and the Traefik listening ports `80` and `443`. That's it. It might look simple and obvious, this is the correct setup. I must emphasize: don't fall into temptation of setting any additional port mappings in `core/docker-compose.local.yml`, functionality will break, all should be done in `core/rathole.client.toml`.

Another note: You might wonder why ports `5080` and `5443` aren't repeated anywhere in the client config `core/rathole.client.toml`. The answer is "no need for it", we already specified port `2333` for the control channel, which will communicate all additional required information between the Rathole server and client.

Now that we have configured the Rathole client, we need to define Rathole client and Traefik containers.

Here is the Rathole client container and the important part of the Traefik container [core/docker-compose.local.yml](https://github.com/nemanjam/traefik-proxy/blob/e8fece09e31ec99ddd21559f343d0ddea9fb55bf/core/docker-compose.local.yml):

```yml
# core/docker-compose.local.yml

services:
  rathole:
    # 1. default official x86 image
    image: rapiz1/rathole:v0.5.0

    # 2. custom built ARM image (for Raspberry pi)
    # image: nemanjamitic/my-rathole-arm64:v1.0

    # 3. build for arm - AVOID, use prebuilt ARM image above
    # build: https://github.com/rapiz1/rathole.git#main
    # platform: linux/arm64

    container_name: rathole
    command: --client /config/rathole.client.toml
    restart: unless-stopped
    volumes:
      - ./rathole.client.toml:/config/rathole.client.toml:ro
    networks:
      - proxy

  traefik:
    image: 'traefik:v2.9.8'
    container_name: traefik
    restart: unless-stopped

    # for this to work both services must be defined in the same docker-compose.yml file
    depends_on:
      - rathole

    # other config...

    networks:
      - proxy

    # leave this commented out, just for explanation
    # Rathole will pass Traffic through proxy network directly on 80 and 443
    # defined in rathole.client.toml
    # ports:
    #   - '80:80'
    #   - '443:443'

    # other config...
```

Let's start with the Rathole service. Similarly to the server command, we run the Rathole binary, this time in client mode with `--client` and we pass the client config file `/config/rathole.client.toml` which we also bind mount as volume. An important part is that we set both the Rathole and Traefik containers on the same **external** network `proxy` so they can communicate with each other and with the host.

Additional notes about the Rathole image:

- Always make sure to use the same Rathole image version for both the server and client for compatibility.
- `x86` - By default, Rathole provides only the `x86` image. If your home server uses that architecture, you are good to go.
- `ARM` - If you have an ARM home server (e.g., Raspberry Pi), you will have to build the image yourself or use a prebuilt, unofficial one. **Avoid** building images on low-power ARM single-board computers, as it will take a long time and require a lot of RAM and CPU power. Instead, either pre-build one yourself and push it to Docker Hub, or you can reuse my `nemanjamitic/my-rathole-arm64:v1.0` image (which uses Rathole `v0.5.0`).

Now, the Traefik container. It must be on the same `proxy` external network as Rathole. Another important part: It must **wait** for the Rathole container to boot up `depends_on: rathole`, because the traffic will come from the Rathole tunnel. **Do not** expose ports `80` and `443`, Rathole has already bound those Traefik container ports, as we defined in the Rathole client config `core/rathole.client.toml`.

The rest of the Traefik container definition is left out here because it's the usual configuration, unrelated to the Rathole tunnel. Below is a quick reminder about the general Traefik configuration.

**Traefik reminder**

1. Provide the `.env` file with variables needed for Traefik:

```bash
cp .env.example .env
```

```bash
# .env"

SITE_HOSTNAME=homeserver.my-domain.com

# important: must put value in quotes "..." and escape $ with \$
TRAEFIK_AUTH=

# will receive expiration notifications
TRAEFIK_LETSENCRYPT_EMAIL=myname@example.com
```

2. On your home server host OS you must create an external Docker network:

```bash
docker network create proxy
```

3. Create `acme.json` file with permission `600`:

```bash
touch ~/homelab/traefik-proxy/core/traefik-data/acme.json

sudo chmod 600 ~/homelab/traefik-proxy/core/traefik-data/acme.json
```

4. Always start with the staging Acme server for testing and swap to production once satisfied:

```yml
# core/traefik-data/traefik.yml

certificatesResolvers:
  letsencrypt:
    acme:
      # always start with staging certificate
      caServer: 'https://acme-staging-v02.api.letsencrypt.org/directory'
      # caServer: 'https://acme-v02.api.letsencrypt.org/directory'
```

5. To clear the temporary staging certificates, clear the contents of `acme.json`

```bash
truncate -s 0 acme.json
```

That's it. Once done, we can run Rathole client and Traefik containers on our home server with:

```bash
docker compose -f docker-compose.local.yml up -d
```

![Running containers on the home server](https://cdn.hashnode.com/res/hashnode/image/upload/v1746081651471/d54ff71d-7ad8-443c-b2da-4bc540751502.png align="center")

## Exposing multiple servers

Fortunately, Rathole makes it trivial to run multiple tunnels using a single Rathole server. We don't need to open any additional ports in the firewall or run multiple container instances. What we do need are different tunnel names, token values, and ports. Those must be unique for each tunnel/service. Also, you will need a load balancer to bind ports `80` and `443` to more than one destination port, respectively.

I wrote a detailed tutorial on how to expose multiple home servers using a single Rathole server. You can read it here: [Load balancing multiple Rathole tunnels with Traefik HTTP and TCP routers](/blog/2025-05-29-traefik-load-balancer).

## Open the firewall on the VPS

Like for any webserver, on the VPS you will need to open ports `80` and `443` to listen for HTTP/HTTPS traffic. Additionally you will need to open the port `2333` for the Rathole control channel - tunnel.

![Opened port for Rathole tunnel in the firewall](https://cdn.hashnode.com/res/hashnode/image/upload/v1746081670354/98ecdaf0-a460-4237-8eea-f621b3ac34b5.png align="center")

## Completed code

- **Rathole server:** https://github.com/nemanjam/rathole-server
- **Rathole client and local Traefik:** https://github.com/nemanjam/traefik-proxy/tree/main/core

## Conclusion

Most consumer-grade internet connections are behind a CGNAT. This setup allows you to bypass CGNAT and host an unlimited number of websites on your home server almost for free. You can use it for web servers in virtual machines, LXC containers, SBC computers, etc. - anywhere you can run Docker.

It is simple, cheap, and you can set it up in 30 minutes. Like anything, it also has some downsides, one of them is the overhead latency caused by an additional network hop between the VPS and your home network, but it's a reasonable tradeoff.

Did you make something similar yourself? Can you see room for improvement? Did you use a different method? You tried to run the code and need help with troubleshooting? Let me know in the comments.

![Orange Pi hero image](https://cdn.hashnode.com/res/hashnode/image/upload/v1746083876612/e2f6bde0-0945-4230-bdb3-18eab7e56500.webp align="center")

## References

- Rathole repository https://github.com/rapiz1/rathole
- Local or remote Traefik discussion https://github.com/rapiz1/rathole/issues/169
- Local and remote Traefik comparison, Tailscale benchmarks https://blog.mni.li/posts/caddy-rathole-zero-knowledge/
- Rathole Docker example configuration https://nitinja.in/tech/
- Rathole `.toml` environment variables discussion https://github.com/rapiz1/rathole/issues/218
- frp repository https://github.com/fatedier/frp

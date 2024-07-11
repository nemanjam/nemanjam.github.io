
### Expose local dev webserver over ssh tunnel

```bash
ssh -R 1080:localhost:3000 ubuntu@152.70.160.21
curl http://152.70.160.21:1080

# shorter version
ssh -R 1080:localhost:3000 amd2
curl http://amd2.nemanjamitic.com:1080

# flush
sudo iptables -F
# list
sudo iptables -L
# check
ss -tuln | grep 1080
```
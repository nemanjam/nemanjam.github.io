
### Expose local dev webserver over ssh tunnel

```bash
ssh -R 1080:localhost:3000 ubuntu@152.70.160.21
curl http://152.70.160.21:1080

# shorter version
ssh -R 1080:localhost:3000 amd2
curl http://amd2.nemanjamitic.com:1080

# flush, works without server and ssh reboot
sudo iptables -F
# list
sudo iptables -L
# check
ss -tuln | grep 1080
```

### Sitemap, RSS and Json feed links

```bash
# root
https://nemanjamitic.com/sitemap-index.xml

# all links
https://nemanjamitic.com/sitemap-0.xml

# robots.txt
https://nemanjamitic.com/robots.txt

# RSS
https://nemanjamitic.com/api/feed.xml

# Json
https://nemanjamitic.com/api/feed.json
```
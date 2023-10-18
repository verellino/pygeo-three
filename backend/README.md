### Run Django Server
```
source backend/bin/activate
python3 manage.py runserver
```

### Docker Container Pygeo
docker run -it --name pygeo --mount "type=bind,src=/home/verellino/code/pygeo/backend,target=/home/mdolabuser/mount/" u22-gcc-ompi-stable /bin/bash

```
docker start pygeo
docker exec -it pygeo /bin/bash
```

Running system commands or installing system software inside the container, e.g. using apt-get requires running sudo, followed by a password. The following password can be used in all images, temppass
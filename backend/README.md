### Install Libraries
```
python3 -m pip install -r requirements.txt
```

#### Pygeo Library Installation
```
cd pyspline-main
pip install .

cd pygeo-main
pip install .
```

### Run Django Server
```
source backend/bin/activate
cd backend
python3 manage.py runserver
```

### Docker Container Pygeo
docker run -it --name pygeo --mount "type=bind,src=/home/verellino/code/pygeo/backend,target=/home/mdolabuser/mount/" u22-gcc-ompi-stable /bin/bash

```
docker start pygeo
docker exec -it pygeo /bin/bash
```

Running system commands or installing system software inside the container, e.g. using apt-get requires running sudo, followed by a password. The following password can be used in all images, temppass
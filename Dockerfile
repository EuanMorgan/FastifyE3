# Docker file creates the image


FROM node:16-alpine 
# Alpine is a lightweight version 

# Add to tmp directory, then install then move our deps
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock

# Install deps without creating a lockfile
RUN cd /tmp && yarn --pure-lockfile

# Copy over back to source
ADD ./ /src

RUN cp -a /tmp/node_modules /src/

WORKDIR /src

RUN npx prisma generate
RUN npm run-script build

# We don't need to expose the port because we are using a reverse proxy

CMD ["node", "build/src/app.js"]
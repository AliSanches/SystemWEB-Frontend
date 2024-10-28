FROM node as build

WORKDIR /tmp/sigprev-backend/
COPY . /tmp/sigprev-backend/
RUN npm install --legacy-peer-deps
ENV VITE_API_URL="https://api.sigprev.app"
RUN npm run build

FROM httpd as deploy

COPY --from=build /tmp/sigprev-backend/build /usr/local/apache2/htdocs/

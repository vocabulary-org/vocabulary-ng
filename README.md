# VocabularyNg
## Backend Requirement
This Anuglar app, requires the backend service to be running in order to work correctly.

Start the backend from the [vocabulary-rest](https://github.com/egch/vocabulary-rest) repository:

```bash
cd vocabulary-rest
mvn spring-boot:run
```

## Development server

To start a local development:

```bash
ng serve
```

## Configurations
### Local with nginx
Requires to define the following entry in the `/etc/hosts` file.   
Requires the backend running with nginx and KC configured properly.
```shell
127.0.0.1 localhost keycloak.local
```
How to start it
```shell
ng serve --configuration=local-nginx
```
### Connect to the remote API running on Hetzner
```shell
ng serve --configuration=hetzner-nginx-ssl
```

## Keycloak Angular
[Keycloak Angular](https://www.npmjs.com/package/keycloak-angular)

```shell
$ npm install keycloak-angular keycloak-js
```

## Installing components
### Header
```shell
ng generate component header  --skip-tests  --type=component
```

### Services
```shell
ng generate service service/word  --skip-tests  --type=service
```
### Models
```shell
ng generate class model/word --type=model --skip-tests
```

### Interfaces
```shell
ng generate interface shared/model/language
```


## Accessing from other devices
Get the IP of your mac
```shell
ipconfig getifaddr en0
```

```shell
ng serve --host 0.0.0.0 --port 4200
```

## 🌐 Frontend Deployment (Angular + Azure Static Web App + Cloudflare)

The `vocabulary-ng` application is deployed using **Azure Static Web Apps**, with **Cloudflare** managing DNS, SSL termination, and reverse proxy.

### 🔗 Production URL

https://www.myvocabulary.net

---

### 🏗 Architecture

Browser  
↓  
Cloudflare (DNS + SSL + WAF + CDN)  
↓  
Azure Static Web App  
↓  
Angular 19 Application  

---

### ⚙️ Cloudflare DNS Configuration

Create the following DNS record in Cloudflare:

Type: CNAME  
Name: www  
Content: polite-ocean-00b80a103.3.azurestaticapps.net  
Proxy status: Proxied (🟠)  
TTL: Auto  

During Azure domain validation, you may temporarily switch Proxy to **DNS only (⚪)** if verification fails.

---

### ☁️ Azure Configuration

1. Go to Azure → Static Web App → Custom domains  
2. Add: www.myvocabulary.net  
3. Choose CNAME validation  
4. Wait for the Managed SSL certificate to be provisioned  

Azure automatically issues a free HTTPS certificate for the custom domain.

---

### 🔐 SSL Settings (Cloudflare)

Set SSL/TLS mode to:

Full (strict)

This ensures secure end-to-end HTTPS between Cloudflare and Azure.

---

### 🚀 Build Command

ng build --configuration production

Deployment is handled automatically via Azure Static Web Apps GitHub integration.

---

### 🧠 Notes

- The `www` subdomain points directly to Azure (not to the root domain).
- SSL provisioning may take a few minutes after domain validation.
- After successful validation, ensure Cloudflare Proxy is enabled (🟠).


---

## 🤖 Cloudflare Turnstile (CAPTCHA)

The registration page uses [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) to protect against bots.

### How it works

1. The Turnstile widget renders in the browser and runs invisible bot-detection checks.
2. On success, Cloudflare returns a short-lived token to the frontend.
3. The token is sent to the backend via the `CF-Turnstile-Response` request header.
4. The backend verifies the token against Cloudflare's `siteverify` API using a secret key.

### Configuration

Turnstile is enabled only when `turnstileSiteKey` is set in the environment file. It is currently active for the `hetzner-nginx-ssl` environment only.

| Environment | Turnstile |
|---|---|
| `environment.ts` (local) | Disabled (`turnstileSiteKey: ''`) |
| `environment.local-nginx.ts` | Disabled |
| `environment.local-nginx-ssl.ts` | Disabled |
| `environment.hetzner-nginx-ssl.ts` | Enabled |

### Local testing

To test Turnstile locally, add `localhost` to the **Allowed Hostnames** list in the Cloudflare dashboard (Turnstile → your site → Settings).

Alternatively, use Cloudflare's official test site key in `environment.ts` (always passes, no real verification):

```typescript
turnstileSiteKey: '1x00000000000000000000AA'
```

The corresponding backend test secret key is `1x0000000000000000000000000000000AA`.

---


# Default Doc
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



# Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

------

### Running update terakhir

- Pastikan database sudah running

- untuk javascript/adonisjs:

  ```bash
  npx adonis migration:run
  ```

- untuk python/Flask:

  pastikan sudah di dalam project direktori dan terkoneksi internet

  ```bash
  pip install -r requirements.txt
  ```

- kemudian jalankan seperti biasa

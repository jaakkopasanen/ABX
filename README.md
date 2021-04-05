# ABX
Web app for creating and conducting AB and ABX listening tests.

## Create your own test
ABX app is available at [abxtests.com](https://abxtests.com). You can use this to create your own listening tests by
creating a simple configuration file, saving it to a publicly hosted location along with the audio samples and sending
the participants link with the configuration file. A listening test link looks like this:

https://abxtests.com/?test=https://www.dropbox.com/s/c00dylhi7ekqkfw/demo.yml?dl=0

The link after `?test=` is the Dropbox share link of the configuration file. **Replace the link with your own.**

Dropbox works nicely for this purpose but so does any other hosting solution. The only requirements are that the service
actually sends the file with correct content type. Dropbox share links are meant for humans and come with the
whole Dropbox UI, but ABX ap will automatically turn the link into a correct download link. Unfortunately Google Drive
doesn't provide correct content types and therefore cannot be used for hosting the configuration files and audio clips.

The configuration file itself is written with [YAML](https://yaml.org/) syntax. This is rather human friendly and should
be easy enough for you to get started right away without any prior experience with it. If you need to make changes
during the study, you should always create a new separate file and distribute the new links to the participants instead
of editing the existing file! This keeps things consistent.

Here's an example file:
```yaml
name: Demo test
welcome:
  description: |-
    #### ABX Demo

    This is a demo listening test showing how ABX listening tests app works from the listener's perspective.

    In this listening test you'll be given three different options with different compression methods
    and your task is to choose your preferred option. There are two different clips with 10 iterations
    each. This is an AB test. ABX tests where the listener needs to tell if sample X is the same as
    sample A or sample B. Greater number of sample options is supported although it's recommended to
    keep the number relatively low to avoid overloading the listener.

    You'll see your results at the end. It would also be possible to have the test send the results to
    the researcher by supplying an email in the configuration file but this test does not do so. The form
    below is an example of what can be done to gather statistics about the different demographics. The
    email sent to the research would also include the form data.
  form:
    - name: Age
      inputType: number
    - name: Gender
      inputType: select
      options:
        - Female
        - Male
        - Other
    - name: Experience
      inputType: select
      options:
        - Trained listener
        - Audio engineer
        - Audio retailer
        - Audio reviewer
        - Self-proclaimed audiophile
        - Musician
        - None of the above
results:
  description: |-
    ### Results

    Here are your results
options:
  - name: Sons of Winter and Stars (lossless)
    audioUrl: https://www.dropbox.com/s/9e92quf9tr7aj8s/Wintersun%20-%20Sons%20of%20Winter%20and%20Stars%20lossless.wav?dl=0
    tag: lossless
  - name: Sons of Winter and Stars (64 kbps MP3)
    audioUrl: https://www.dropbox.com/s/epvit0keu9w7emp/Wintersun%20-%20Sons%20of%20Winter%20and%20Stars%2064%20kbps.mp3?dl=0
    tag: 64 kbps
  - name: Sons of Winter and Stars (32 kbps MP3)
    audioUrl: https://www.dropbox.com/s/6y0av9tydwsfv6y/Wintersun%20-%20Sons%20of%20Winter%20and%20Stars%2032%20kbps.mp3?dl=0
    tag: 32 kbps
  - name: Hotel California (lossless)
    audioUrl: https://www.dropbox.com/s/9j3zdynxrfipezn/Eagles%20-%20Hotel%20California%20lossless.wav?dl=0
    tag: lossless
  - name: Hotel California (64 kbps MP3)
    audioUrl: https://www.dropbox.com/s/5p1gayvfmb3fc0z/Eagles%20-%20Hotel%20California%2064%20kbps.mp3?dl=0
    tag: 64 kbps
  - name: Hotel California (32 kbps MP3)
    audioUrl: https://www.dropbox.com/s/bu5aa181sk3q2ca/Eagles%20-%20Hotel%20California%2032%20kbps.mp3?dl=0
    tag: 32 kbps
  - name: Bird on a Wire (lossless)
    audioUrl: https://www.dropbox.com/s/5froi1pxux8pns0/Jennifer%20Warnes%20-%20Bird%20on%20a%20Wire%20lossless.wav?dl=0
    tag: lossless
  - name: Bird on a Wire (64 kbps MP3)
    audioUrl: https://www.dropbox.com/s/7jb5cif5o5bda9n/Jennifer%20Warnes%20-%20Bird%20on%20a%20Wire%2064%20kbps.mp3?dl=0
    tag: 64 kbps
  - name: Bird on a Wire (32 kbps MP3)
    audioUrl: https://www.dropbox.com/s/2qfxv4x346p1xdi/Jennifer%20Warnes%20-%20Bird%20on%20a%20Wire%2032%20kbps.mp3?dl=0
    tag: 32 kbps
tests:
  - testType: ABX
    name: Jennifer Warnes - Bird on a Wire
    description: Select the most preferred option
    options:
      - Bird on a Wire (lossless)
      - Bird on a Wire (64 kbps MP3)
      - Bird on a Wire (32 kbps MP3)
    repeat: 10
  - testType: ABX
    name: Eagles - Hotel California
    description: Select the most preferred option
    options:
      - Hotel California (lossless)
      - Hotel California (64 kbps MP3)
      - Hotel California (32 kbps MP3)
    repeat: 10
  - testType: AB
    name: Wintersun - Sons of Winter and Stars
    description: Select the most preferred option
    options:
      - Sons of Winter and Stars (lossless)
      - Sons of Winter and Stars (64 kbps MP3)
      - Sons of Winter and Stars (32 kbps MP3)
    repeat: 10
email: youremail@gmail.com
```
You can start by copying this file, changing some fields, saving it to your Dropbox and getting the share link to test.

If you're just looking for a super simple starting point, then maybe this one will serve you better. This is the minimal
YAML file you can have. Only one test with two different audio samples.
````yaml
name: Minimal listening test
welcome:
  description: |-
    ### Minimal listening test
options:
  - name: lossless
    audioUrl: https://www.dropbox.com/s/9e92quf9tr7aj8s/Wintersun%20-%20Sons%20of%20Winter%20and%20Stars%20lossless.wav?dl=0
  - name: 64 kbps
    audioUrl: https://www.dropbox.com/s/epvit0keu9w7emp/Wintersun%20-%20Sons%20of%20Winter%20and%20Stars%2064%20kbps.mp3?dl=0
tests:
  - name: Lossless vs 64 kbps
    testType: ABX
    options:
      - lossless
      - 64 kbps
````

`name` specifies the name of the listening test. This is only to make it easier for you to tell which results come
from which listening tests.

`welcome` details the welcome screen which is shown to the participants before the actual listening tests are launched.
`description` can be used for giving instructions to the participants. The
description uses [Markdown](https://www.markdownguide.org/basic-syntax/) syntax. Note the strange `|-` after the
`description: `, this tells YAML that the following is a multi-line text and without this the line breaks will be
replaced with spaces.

`form` is optional and can be used as a survey for collecting demographics information from the participants. You should
avoid collecting personally identifiable information. Form can have any number of input fields, these are listed with the
bullet point syntax. Each input field needs to know a name and an `inputType`. Supported types are `text`, `number` and
`select` (dropdown). List the set of available options for `select` type input with the same bullet point syntax.

`results` section only has an optional `description` field, which is similar to the welcome screen description. The
results are shown after all of the tests have been completed. The description is displayed at the top of the results
screen.

`options` list the audio samples used in **all** of the listening tests. First you declare the options in this section
and then in the tests sections you can simply reference them with their names. Each option has the name as the identifier
and can to have two additional fields: `audioUrl` for specifying where the audio clip is hosted and `tag` for grouping
options together for statistical analysis. `tag` is optional and if you omit it, there won't be aggregated statistics
in the results. Keep in mind to only group together audio clips which should be analyzed together. In this example all
of the 32 kpbs MP3 clips are grouped together, as are 64 kbps and lossless clips. The results include aggregated
statistics for each combination of tags that appeared together in the tests. If you have one test with samples with tags
`32 kbps` and `lossless` and another with tags `64 kbps` and `lossless`, these two tests won't have shared aggregated
statistics because they had different combinations of tags.

`tests` section lists the actual listening tests. There can be any number of tests but in practice this should be quite
limited to avoid exhausting the participants. Each test has four different fields:
- `testType` tells if the listening test is AB or ABX.
- `name` is the title of the test and is displayed to the user at the top of each test screen and in the results page.
- `description` of the test is a single piece of text shown to the user below the title. Markdown is not supported here.
- `options` list the audio clip names. The clips will be randomly shuffled in each test iteration.
- `repeat` tells how many iterations of the test should be done. Optional, defaults to 10 iterations.

`email` specifies the email address where the results should be sent to. This is optional and can be omitted if you
don't wish to collect the results. The results will be provided as JSON documents.

### Audio Samples
ABX only plays the audio samples defined in the configuration file. There is no processing (apart from volume slider)
so all the effects under test need to be applied to the audio samples themselves.

All audio samples **MUST** be exactly the same length, down to a sample, because the samples are playing in loop and if
the samples are of different lengths, they will get out of sync. All audio samples also **MUST** have the same sample
rate. This is a limitation of the current technical implementation and *might* change in the future (or might not).

The audio samples should be looping friendly, meaning that if the sample starts and end abruptly, the users will be
greeted with a loud pop sound whenever the audio loops back to the beginning. Applying fade-in in the beginning of each
sample and fade-out at the end is a good way to avoid this.

## Deployment
Read on if you're interested in deploying and hosting ABX yourself.

### Deploy with Docker
Easiest way to deploy ABX is with Docker. The entire application is configured with environment variables. Here's an
example of how to the deployment works for the official abxtests.com domain:
```bash
docker run -d --restart on-failure --name abx \
-p 80:80 -p 443:443 \
-v /abx:/abx:ro \
-v /etc/letsencrypt/live/abxtests.com:/etc/letsencrypt/live/abxtests.com:ro \
-v /etc/letsencrypt/archive/abxtests.com:/etc/letsencrypt/archive/abxtests.com:ro \
-e NODE_ENV=production \
-e HTTP_PORT=80 \
-e HTTPS_PORT=443 \
-e SSL_CERT_PATH=/etc/letsencrypt/live/abxtests.com/fullchain.pem \
-e SSL_PRIVATE_KEY_PATH=/etc/letsencrypt/live/abxtests.com/privkey.pem \
-e EMAIL_FROM_ADDRESS=noreply@abxtests.com \
-e EMAIL_FROM_NAME="ABX" \
-e MAILJET_API_KEY_PUBLIC=/abx/mailjet_api_key_public \
-e MAILJET_API_KEY_PRIVATE=/abx/mailjet_api_key_private \
jaakkopasanen/abx:latest
```

- `-d` runs the container in detached mode
-`--restart on-failure` makes the Docker engine restart the container if it
crashes
- `--name abx` sets the container name
- `-p 80:80 -p 443:443` exposes ports 80 (for HTTPS) and 443 (for HTTPS)
- `-v /abx:/abx:ro` binds directory `/abx` on the host to the container in the same location. This is where the API
keys for Mailjet reside.
- `-v /etc/letsencrypt/live/abxtests.com:/etc/letsencrypt/live/abxtests.com:ro` and
`-v /etc/letsencrypt/archive/abxtests.com:/etc/letsencrypt/archive/abxtests.com:ro` bind letsencrypt certificate
directories to the container. These are needed for HTTPS.
- `-e NODE_ENV=production` tells NodeJS to run in production mode
- `-e HTTP_PORT=80` tells the HTTP server to listen port 80
- `-e HTTPS_PORT=443` tells the HTTPS server to listen port 443
- `-e SSL_CERT_PATH=/etc/letsencrypt/live/abxtests.com/fullchain.pem` tells the HTTPS server where to find SSL
certificate public key
- `-e SSL_PRIVATE_KEY_PATH=/etc/letsencrypt/live/abxtests.com/privkey.pem` tells the HTTPS server where to find the SSL
certificate private key
- `-e EMAIL_FROM_ADDRESS=noreply@abxtests.com` tells the emailer which from address should be set to the emails
- `-e EMAIL_FROM_NAME="ABX"` tells the emailer which name should be set to the emails
- `-e MAILJET_API_KEY_PUBLIC=/abx/mailjet_api_key_public` tells the emailer where to find the Mailjet public API key
- `-e MAILJET_API_KEY_PRIVATE=/abx/mailjet_api_key_private` tells the emailer where to find the Mailjet private API key
- `jaakkopasanen/abx:latest` this specifies the Docker image. Here we are using the latest version but there are also
tags available with semantic versioning (such as 1.1.0).

### Docker build and push
Build your own Docker image if you don't want to use one from jaakkopasanen. Docker build includes production build of
the React app and all other necessary steps.
```bash
docker build -t yourdockerhubusername/abx:latest .
docker push yourdockerhubusername/abx:latest
```

## Development
Read on if you're interested in developing ABX.

### Dev Server
```
npm run start
```
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

```
npm run dev
```
Launches the backend server in development mode. This too has automatic reloads.

### Tests
```
npm run test
```
Launches the test runner in the interactive watch mode.

### Production
Production build is done in the Docker build but if you'd like to create production build manually outside of Docker,
run:
```
npm run build
```
This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes
the build for the best performance.

The build is minified and the filenames include the hashes. ABX is ready to be deployed!

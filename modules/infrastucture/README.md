Here we provision various parts of our infrastucture, or at least document how they are done

AWS CodeBuild
================

With [Cody](https://cody.run/). With some clever shell scripting to handle this more monorepo style of development.


AVS Code Pipeline
===============

Manually configured (for now?). Takes artifacts from CodeBuild and sends them to S3 bucket.


Static Asset / CDN Hosting
==============

Provided by S3 / CloudFront / Route53 (manually configured).


AWS Cognito Pools
==============

Manually Configured (for now).

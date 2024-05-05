<p align="center">
  <a href="https://github.com/chrislennon/action-aws-cli"><img alt="GitHub Actions status" src="https://github.com/chrislennon/action-aws-cli/workflows/master%20builds/badge.svg"></a>
</p>

# action-install-aws-cli

Action to install the most recent version of the [AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)

Installs on:
- ubuntu-latest
- windows-latest
- macos-latest

Can add
- ubuntu-16.04
- windows-2016
- windows-2019
- macOS-10.14
- ubuntu-18.04

Updates on:
[TBD]

## Usage

Example
````yaml
name: List S3 Contents - Multi OS

on:
  push
jobs:
  listS3:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macOS-latest, windows-latest, ubuntu-latest]
    steps:
      - uses: ohthepain/action-install-aws-cli@v1.1
      # All commands after this point have access to the AWS CLI
      - run: aws s3 ls
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
````

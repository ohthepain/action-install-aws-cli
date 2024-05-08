<p align="center">
  <a href="https://github.com:ohthepain/action-install-aws-cli"><img alt="GitHub Actions status" src="https://github.com/ohthepain/action-install-aws-cli/workflows/master%20builds/badge.svg"></a>
</p>

# action-install-aws-cli

Action to install the most recent version of the aws cli.

## Supported Platforms
- windows-latest
- macos-latest

Not necessary on platforms that already have aws cli installed:
- ubuntu-latest

To considering adding: ubuntu-16.04, windows-2016, windows-2019, macOS-10.14, ubuntu-18.04

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
        os: [macOS-latest, windows-latest]
    steps:
      - uses: ohthepain/action-install-aws-cli@v1.1
      # All commands after this point have access to the AWS CLI
      - run: aws s3 ls
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}
````

FROM ruby:3.3-alpine

ARG PACKAGES="build-base git nodejs tzdata bash"

RUN apk update \
    && apk upgrade \
    && apk add --update --no-cache $PACKAGES

ARG SITE_ROOT=/srv/jekyll
RUN mkdir -p $SITE_ROOT
WORKDIR $SITE_ROOT

RUN gem install bundler:2.5.23

COPY site/Gemfile site/Gemfile.lock ./
RUN bundle install --jobs 5

ADD site/ $SITE_ROOT
ENV PATH=$SITE_ROOT/bin:${PATH}

EXPOSE 4000
CMD bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch --force_polling

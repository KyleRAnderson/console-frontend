#!/bin/sh

if [ ! -z "${REACT_APP_API_BASE_URL+x}" ]; then
    echo "window.appConfig = {
    REACT_APP_API_BASE_URL: \"${REACT_APP_API_BASE_URL}\",
};" > "${APP_ROOT_LOCATION}"/appConfig.js
fi

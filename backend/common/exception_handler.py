from rest_framework.views import exception_handler


def exception_handler_middleware(exc, context):
    customized_response = {
        "status": "",
        "details": {}
    }
    response = exception_handler(exc, context)

    if response is not None:
        customized_response['status'] = response.status_code
        if response.status_code == 404:
            customized_response['details'] = {
                "detail": ["Requested resource was not found"]
            }
        elif response.status_code == 400:
            customized_response['details'] = response.data
        elif response.status_code == 405:
            customized_response['details'] = response.data
        elif response.status_code == 401:
            if response.data.get('detail').code == 'no_active_account' \
                    or response.data.get('detail').code == 'authentication_failed':
                customized_response['details'] = {
                    "detail": ["Enter a valid username or password"]
                }
            else:
                customized_response['details'] = response.data
        else:
            customized_response['details'] = response.data

        response.data = customized_response

    return response

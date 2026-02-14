 $(function() {

    // Get the form.
    var form = $('#contact-form');

    // Get the messages div.
    var formMessages = $('#form-message');

    // Set up an event listener for the contact form.
    $(form).submit(function(e) {
        // Stop the browser from submitting the form.
        e.preventDefault();

        // Hide previous messages
        $(formMessages).hide().removeClass('success error');

        // Disable submit button to prevent double submission
        var submitButton = $(form).find('button[type="submit"]');
        var originalText = submitButton.html();
        submitButton.prop('disabled', true).html('<span>Sending... <i class="icon-arrow-right"></i></span>');

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        })
        .done(function(response) {
            // Make sure that the formMessages div has the 'success' class.
            $(formMessages).removeClass('error');
            $(formMessages).addClass('success');

            // Set the message text (handle both JSON and plain text responses)
            var message = typeof response === 'object' && response.message ? response.message : response;
            $(formMessages).html(message).slideDown();

            // Clear the form.
            $(form)[0].reset();
            
            // Reset select dropdown if using nice-select
            if ($(form).find('.single-select').length) {
                $(form).find('.single-select').val('').trigger('change');
            }

            // Scroll to message
            $('html, body').animate({
                scrollTop: $(formMessages).offset().top - 100
            }, 500);
        })
        .fail(function(data) {
            // Make sure that the formMessages div has the 'error' class.
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');

            // Set the message text (handle both JSON and plain text responses)
            var errorMessage = 'Oops! An error occurred and your message could not be sent.';
            if (data.responseJSON && data.responseJSON.error) {
                errorMessage = data.responseJSON.error;
            } else if (data.responseText && data.responseText.trim() !== '') {
                try {
                    var jsonResponse = JSON.parse(data.responseText);
                    errorMessage = jsonResponse.error || errorMessage;
                } catch (e) {
                    errorMessage = data.responseText;
                }
            }
            $(formMessages).html(errorMessage).slideDown();

            // Scroll to message
            $('html, body').animate({
                scrollTop: $(formMessages).offset().top - 100
            }, 500);
        })
        .always(function() {
            // Re-enable submit button
            submitButton.prop('disabled', false).html(originalText);
        });
    });

});
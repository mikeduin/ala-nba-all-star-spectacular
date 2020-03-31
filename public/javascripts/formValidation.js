$(document).ready(() => {
  $("form[name='regForm']").validate({
    rules: {
      username: 'required',
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 5
      },
      confirmPassword: {
        equalTo: '#regPassword'
      },
      firstName: 'required',
      lastName: 'required'
    },
    messages: {
      username: 'Username is required',
      email: 'Please enter a valid email address',
      firstName: 'First name is required',
      lastName: 'Last name is required',
      confirmPassword: 'Passwords must match'
    },
    errorElement: 'em',
    submitHandler: function () {
      data = {
        username: $('#regUsername').val(),
        email: $('#regEmail').val(),
        password: $('#regPassword').val(),
        firstName: $('#regFirstName').val(),
        lastName: $('#regLastName').val()
      };
      $.ajax({
          url: "/auth/register",
          data: data,
          type: 'post',
          success: function (res) {
            window.location.href = '/';
          },
          error: function (res) {
            $('.error-msg').removeClass('hidden');
            $('.error-msg').text(res.responseJSON.message);
          }
      });
    }
  })
})

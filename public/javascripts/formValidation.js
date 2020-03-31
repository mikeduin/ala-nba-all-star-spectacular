$(document).ready(() => {
  console.log('validation script active');
  // $.validator.setDefaults({
  //   // messages: {
  //   //   username: 'Username is required',
  //   //   email: 'Please enter a valid email address',
  //   //   firstName: 'First name is required',
  //   //   lastName: 'Last name is required'
  //   // },
  //   errorPlacement: function(error, element) {
  //     $(element)
  //       .closest("form")
  //       .find("label[for='" + element.attr("id") + "']")
  //       .attr('data-error', error.text());
  //   }
  // });
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
    submitHandler: function (form) {
      form.submit();
    }
  })
})

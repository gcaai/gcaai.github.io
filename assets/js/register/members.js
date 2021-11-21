// Create a Stripe client.
var stripe = Stripe('pk_live_E7VJhFCnthav75gjdwkCcCOa');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
    base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
        color: '#aab7c4'
    }
    },
    invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
    }
};

var cardElement = elements.create('card', {style: style})

cardElement.addEventListener('change', function(event) {
var displayError = document.getElementById('card-errors');
if (event.error) {
    displayError.textContent = event.error.message;
} else {
    displayError.textContent = '';
}
});
cardElement.mount('#card-element');


function validateForm() {

    var first_name = document.forms["registerform"]["userfirstname"].value;
    var last_name = document.forms["registerform"]["userlastname"].value;
    var email = document.forms["registerform"]["email"].value;

    var data_declare =  document.getElementById("declaredata").checked;
    var data_protect = document.getElementById("dataprotect").checked;
    var credit_card = document.getElementById("creditcard").checked;
    var yes_to_member = document.getElementById("yestomember").checked;


    if (first_name == "" || first_name == undefined) {
        alert("first_name is required to be filled. ");
        return false;
    } else if (last_name == "" || last_name == undefined) {
        alert("last_name is required to be filled. ");
        return false;
    } else if (email == "" || email == undefined) {
        alert("email is required to be filled. ");
        return false;
    } else if (data_declare == false ){
        alert("You can get registered, only if you agree with our data declaration. Please check wether all the check boxes have been ticked. ");
        return false;
    } else if(data_protect == false){
        alert("You can get registered, only if you have read our privacy declarations.Please check wether all the check boxes have been ticked. ");
        return false;
    } else if (credit_card == false){
        alert("You can get registered, only if you agree with the payment declaration from our side. Please check wether all the check boxes have been ticked. ")
        return false;
    } else if (yes_to_member == false){
        alert("You can get registered, only if you agree to become our official member. Please check wether all the check boxes have been ticked. ");
    } else {
        return true;
    }

  }


function register(){
    
    
    var validate_result = validateForm();

    $('#progress25').modal('toggle')
    $('#progress25').modal('show');

    console.log("validate result " + validate_result);

    if ( validate_result ){
        

        var entries = document.getElementById("registerform").elements;
        var obj ={};

        for(var i = 0 ; i < entries.length ; i++){
            var item = entries.item(i);

            if (item.name!="" && item.name!=undefined){
                
                // first time set value of item.name, pure string assignment
                if (obj[item.name] == undefined){
                    if(item.type=="select")
                        obj[item.name] = item.options[item.selectedIndex].value;
                    else if(item.type=="checkbox"){
                        if (item.checked==true)
                            obj[item.name] = item.value;
                    }
                    else
                        obj[item.name] = item.value;
                }
                else { // set the multi selected checked options.
                    if ((typeof obj[item.name])=="string")
                        obj[item.name] = [obj[item.name]]
                    if (item.value!=""){
                        if (item.type=="checkbox"){
                            if (item.checked==true)
                                obj[item.name].push(item.value);
                        }
                    }
                }
            }
        }
        

        var registerJsonBody = {};
        registerJsonBody['register'] = obj;

        const config = {
            stripe: {
            apiUrl: 'https://akbz1j9so1.execute-api.us-east-1.amazonaws.com/dev/charges',
            },
        }


        stripe.createToken(cardElement).then(function(result) {

            setTimeout(() => {
                $('#progress25').modal('toggle');
                $('#progress25').hide();
                $('#progress50').modal('toggle');
                $('#progress50').modal('show');
            }, 100);


            if (result.error) {

                // Inform the user if there was an error.
                var errorElement = document.getElementById('card-errors');
                // errorElement.textContent = result.error.message;
                setTimeout(() => {
                    $('#progress50').modal('toggle');
                    $('#progress50').hide();
                    $('#cardInfoError').modal('toggle');
                    $('#cardInfoError').modal('show');
                    console.error("result token error... ");
                    console.error(result.error);
                }, 600);
                
            } 
            else {
                
            setTimeout(function(){
                $('#progress50').modal('toggle');
                $('#progress50').hide();
                }, 600);
            $('#progress75').modal('toggle');
            $('#progress75').modal('show');

            // Send the token to your server.
            registerJsonBody['token_info'] = result.token;

            console.log("registerJsonBody with token_info");
            console.log(registerJsonBody);

            $.ajax({
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(registerJsonBody),
                dataType: 'json',
                url: config.stripe.apiUrl,
                success: function(jsondata){
                
                    console.log("Success!!!");
                    console.log(jsondata);

                    $('#progress75').modal('toggle');
                    $('#progress75').hide();

                    $('#joinModal').modal('hide');
                    $('#thanksRegisterdModal').modal('show');

                },
                error: function (error) {
                    //alert("Network Error, please check you network.");
                    console.log(error);
                    $('#progress75').modal('toggle');
                    $('#progress75').hide();
                    $('#failedRegisterdModal').modal('show');
                    
                }
            });
                
        }
        });
    }
    setTimeout(() => {
        $('#progress25').modal('toggle');
        $('#progress25').hide();
    }, 600);
}
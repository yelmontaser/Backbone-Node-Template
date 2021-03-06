define(["modules/user"],
	
function(User) {
	var Home = {};

	Home.Splash = Backbone.View.extend({
    	el: "<div>",

		initialize: function() {
			this.render();
      	},

      	events: {
      		"click #signup-button": "signUp",
      		"click #login-button": "login"
      	},

		render: function(){
			var that = this;

			$.get("/app/templates/home/splash.html", function(contents) {
				that.$el.html(_.template(contents));
			}, "text");
		},

		signUp: function() {
  			Backbone.history.navigate('signup', true);
		},

		login: function() {
			Backbone.history.navigate("login", true);
		}
	});

	Home.Login = Backbone.View.extend({
    	el: "<div>",

		initialize: function() {
			this.render();
      	},

      	events: {
      		"click #signup-button": "signUp",
      		"click #login-button": "login",
      		"click #create-account-link": "signUp",
      		"click #log-in-button": "loginUser"
      	},

		render: function(){
			var that = this;

			$.get("/app/templates/home/login.html", function(contents) {
				that.$el.html(_.template(contents));
			}, "text");
		},

		signUp: function() {
  			Backbone.history.navigate('signup', true);
		},

		login: function() {
			Backbone.history.navigate("login", true);
		},

		loginUser: function() {
			var that = this;

			var email = this.$("#email").val();
			var password = this.$("#password").val();

			if (((email) && (email.trim().toLowerCase().length > 0)) && 
				((password) && (password.trim().toLowerCase().length > 0))) {
				$.ajax({
					type: "POST",
					url: "/auth",
					data: {
						username: email,
						password: password
					},
					success: function(response) {
						if (response.status == "success") {
							Backbone.history.navigate("/main", true);
						}
						else {
							that.$("#password").val("");
							that.$("#login-error-message").html(response.message);
						}
					}
				});
			}
			else {
				if (((!email) || (email.trim().toLowerCase().length == 0)) && ((!password) || (password.trim().toLowerCase().length == 0))) {
					this.$("#login-error-message").html("E-mail and password required");
				}
				else if ((!email) || (email.trim().toLowerCase().length == 0)) {
					this.$("#login-error-message").html("E-mail required");
				}
				else if ((!password) || (password.trim().toLowerCase().length == 0)) {
					this.$("#login-error-message").html("Password required");
				}
			}
		}
	});

	Home.SignUp = Backbone.View.extend({
    	el: "<div>",

		initialize: function() {
			this.render();
      	},

      	events: {
      		"click #signup-button": "signUp",
      		"click #login-button": "login",
      		"click #create-account-button" : "createAcount"
      	},

		render: function(){
			var that = this;

			$.get("/app/templates/home/signUp.html", function(contents) {
				that.$el.html(_.template(contents));
			}, "text");
		},

		signUp: function() {
  			Backbone.history.navigate('signup', true);
		},

		login: function() {
			Backbone.history.navigate("login", true);
		},

		createAcount: function() {
			var that = this;

			var username = this.$("#username").val();
			var email = this.$("#email").val();
			var password = this.$("#password").val();
			var passwordConfirm = this.$("#password-confirm").val();

			if (((username) && (username.trim().toLowerCase().length > 0)) && 
				((email) && (email.trim().toLowerCase().length > 0)) && 
				((password) && (password.trim().toLowerCase().length > 0))) {
				if (password == passwordConfirm) {
					var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		
					if (emailFilter.test(email)) {
						var newUser = new User.Model({
						    username: username.trim(),
						    email: email.trim(),
						    password: password
						});

						newUser.save({}, {
							success: function(response) {
								if (response.get("status").trim().toLowerCase() == "success") {
									$.ajax({
										type: "POST",
										url: "/auth",
										data: {
											username: email,
											password: password
										},
										success: function(loginResponse) {
											if (loginResponse.status == "success") {
												Backbone.history.navigate("/main", true);
											}
											else {
												that.$("#password").val("");
												that.$("#password-confirm").val("");
												that.$("#login-error-message").html(loginResponse.message);
											}
										}
									});
								}
								else {
									that.$("#password").val("");
									that.$("#password-confirm").val("");
									that.$("#signup-error-message").html(response.message);
								}
							}
						});
					}
					else {
						this.$("#password").val("");
						this.$("#password-confirm").val("");
						this.$("#signup-error-message").html("Invalid e-mail");
					}
				}
				else {
					this.$("#password").val("");
					this.$("#password-confirm").val("");
					this.$("#signup-error-message").html("Passwords much match");
				}
			}
			else {
				if (((!username) || (username.trim().toLowerCase().length == 0)) && ((!password) || 
					(!email) || (email.trim().toLowerCase().length == 0)) && 
					((!password) || (password.trim().toLowerCase().length == 0))) {
					this.$("#signup-error-message").html("Username, e-mail and password required");
				}
				if (((!email) || (email.trim().toLowerCase().length == 0)) && ((!password) ||
					(password.trim().toLowerCase().length == 0))) {
					this.$("#signup-error-message").html("E-mail and password required");
				}
				else if ((!email) || (email.trim().toLowerCase().length == 0)) {
					this.$("#signup-error-message").html("E-mail required");
				}
				else if ((!password) || (password.trim().toLowerCase().length == 0)) {
					this.$("#signup-error-message").html("Password required");
				}
			}
		}
	});

	return Home;
});
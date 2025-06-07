// Check if variable is already defined to avoid overwriting
if (typeof window.auth_en_US === "undefined") {
    // Define translations for English
    window.auth_en_US = {
        // General
        "app_name": "ZMagic12",
        "language": {
            "pt_PT": "Português (Portugal)",
            "en_US": "English (US)",
            "fr_FR": "Français (France)",
            "es_ES": "Español (España)",
            "de_DE": "Deutsch (Deutschland)",
            "zh_CN": "中文 (简体)"
        },

        // Login
        "login": {
            "title": "Access your account",
            "email_label": "Email",
            "password_label": "Password",
            "remember_me": "Remember me",
            "submit_button": "Sign In",
            "register_link": "Don't have an account?",
            "forgot_password_link": "Forgot your password?",
            "error_invalid_credentials": "Invalid email or password.",
            "error_empty_fields": "Please fill in all fields.",
            "error_generic": "An error occurred while signing in. Please try again.",
            "error_account_inactive": "This account is inactive. Please contact support.",
            "success_message": "Sign in successful! Redirecting...",
            "loading": "Loading...",
            "back_link": "Back to home page",
            "offline_mode": "Offline mode",
            "already_logged_in": "User already logged in:",
            "user_logged_in_message": "User already logged in",
            "logout_button": "Sign Out",
            "continue_button": "Continue with this account",
            "connection_restored": "Connection restored",
            "connection_lost": "Connection lost",
            "connection_error": "Connection error"
        },

        // Registration
        "register": {
            "title": "Create your account",
            "name_label": "Name",
            "email_label": "Email",
            "password_label": "Password",
            "confirm_password_label": "Confirm Password",
            "submit_button": "Register",
            "login_link": "Already have an account?",
            "error_passwords_dont_match": "Passwords do not match.",
            "error_email_in_use": "This email is already in use.",
            "error_generic": "An error occurred during registration. Please try again.",
            "success_message": "Registration successful! Redirecting...",
            "back_link": "Back to home page"
        },

        // Password Recovery
        "recovery": {
            "title": "Recover your password",
            "email_label": "Email",
            "submit_button": "Send Recovery Link",
            "login_link": "Remembered your password?",
            "error_generic": "An error occurred while sending the recovery email. Please try again.",
            "success_message": "Recovery email sent! Please check your inbox.",
            "back_link": "Back to home page"
        },
        
        // Profile
        "profile": {
            "page_title": "User Profile - ZMagic12",
            "title": "User Profile",
            "loading": "Loading...",
            "loading_activities": "Loading activities...",
            "user_avatar": "User Avatar",
            "user_type_prefix": "User type: Loading...",
            
            "tabs": {
                "personal_info": "Personal Information",
                "account_settings": "Account Settings",
                "activity": "Activity",
                "subscription": "Subscription"
            },
            
            "fields": {
                "full_name": "Full Name",
                "organization": "Organization",
                "phone": "Phone Number",
                "country": "Country",
                "newsletter": "Receive notifications and news by email"
            },
            
            "account_settings": {
                "title": "Account Settings",
                "email": "Email",
                "role": "Role",
                "created_at": "Account created on",
                "last_signin": "Last access",
                "terms": "Terms and Conditions",
                "security": "Security",
                "change_password": "Change Password"
            },
            
            "activity": {
                "title": "Account Activity",
                "projects": "Projects",
                "templates": "Templates",
                "archived": "Archived",
                "last_accesses": "Recent Activity"
            },
            
            "subscription": {
                "title": "Subscription Information",
                "current_plan": "Current Plan",
                "start_date": "Start Date",
                "validity": "Valid Until",
                "upgrade_plan": "Upgrade Plan"
            },
            
            "buttons": {
                "save": "Save Changes",
                "cancel": "Cancel"
            }
        }
    };
}

// Export translations for module compatibility
if (typeof module !== "undefined" && module.exports) {
    module.exports = window.auth_en_US;
} 
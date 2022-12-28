const base = module.superModule;

/**
 * Sends the email with password reset instructions
 * @param {string} email - email for password reset
 * @param {Object} resettingCustomer - the customer requesting password reset
 */
function sendPasswordResetEmail2(email, resettingCustomer) {
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

    var passwordResetToken = getPasswordResetToken(resettingCustomer);
    var url = URLUtils.https('Account-SetNewPassword', 'Token', passwordResetToken);
    var objectForEmail = {
        passwordResetToken: passwordResetToken,
        firstName: resettingCustomer.profile.firstName,
        lastName: resettingCustomer.profile.lastName,
        url: url
    };

    var emailObj = {
        to: email,
        subject: Resource.msg('subject.profile.resetpassword.email', 'login', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.passwordChanged
    };

    emailHelpers.sendEmail(emailObj, 'account/password/passwordResetEmail', objectForEmail);
}

base.sendPasswordResetEmail2 = sendPasswordResetEmail2;

module.exports = base;
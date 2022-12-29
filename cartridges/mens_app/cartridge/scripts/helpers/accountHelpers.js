const base = module.superModule;

const URLUtils = require('dw/web/URLUtils');

/**
 * Gets the password reset token of a customer
 * @param {Object} customer - the customer requesting password reset token
 * @returns {string} password reset token string
 */
function getPasswordResetToken(customer) {
    const Transaction = require('dw/system/Transaction');

    const passwordResetToken;
    Transaction.wrap(function () {
        passwordResetToken = customer.profile.credentials.createResetPasswordToken();
    });
    return passwordResetToken;
}

/**
 * Sends the email with password reset instructions
 * @param {string} email - email for password reset
 * @param {Object} resettingCustomer - the customer requesting password reset
 */
function sendPasswordResetEmail2(email, resettingCustomer) {
    const Resource = require('dw/web/Resource');
    const Site = require('dw/system/Site');
    const emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

    const passwordResetToken = getPasswordResetToken(resettingCustomer);
    const url = URLUtils.https('Account-SetNewPassword', 'Token', passwordResetToken);
    const objectForEmail = {
        passwordResetToken: passwordResetToken,
        firstName: resettingCustomer.profile.firstName,
        lastName: resettingCustomer.profile.lastName,
        url: url
    };

    const emailObj = {
        to: email,
        subject: Resource.msg('subject.profile.resetpassword.email', 'login', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.passwordChanged
    };

    emailHelpers.sendEmail(emailObj, 'account/password/passwordResetEmail', objectForEmail);
}

base.sendPasswordResetEmail2 = sendPasswordResetEmail2;

module.exports = base;
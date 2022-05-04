document.addEventListener("DOMContentLoaded", function (event) {
  const deviceSessionIdField = document.getElementById(
    "device_session_id_field"
  );
  const deviceSessionId = OpenPay.deviceData.setup();
  deviceSessionIdField.value = deviceSessionId;

  const month = document.getElementById("month_openpay");
  // Add options to the month select
  // options are in two digits,
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? `0${i}` : i;
    option.text = i < 10 ? `0${i}` : i;
    month.appendChild(option);
  }

  const year = document.getElementById("year_openpay");
  // Add options to the year select
  // options are in four digits
  for (
    let i = new Date().getFullYear();
    i <= new Date().getFullYear() + 10;
    i++
  ) {
    const option = document.createElement("option");
    option.value = i.toString().slice(2);
    option.text = i;
    year.appendChild(option);
  }
});

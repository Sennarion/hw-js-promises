import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import 'flatpickr/dist/flatpickr.min.css';

const pageRefs = {
  buttonRef: document.querySelector('[data-start]'),
  inputRef: document.querySelector('#datetime-picker'),
  daysRef: document.querySelector('[data-days]'),
  hoursRef: document.querySelector('[data-hours]'),
  minutesRef: document.querySelector('[data-minutes]'),
  secondsRef: document.querySelector('[data-seconds]'),
};

// const timer = {
//   start() {},

// };

pageRefs.buttonRef.disabled = true;

const selectedDate = flatpickr(pageRefs.inputRef, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.now() >= selectedDates[0].getTime()) {
      Notiflix.Notify.failure('Please choose a date in the future', {
        clickToClose: true,
      });
      return;
    }
    pageRefs.buttonRef.disabled = false;
  },
});

function startTimer() {
  pageRefs.buttonRef.disabled = true;
  let diff = selectedDate.selectedDates[0].getTime() - Date.now();

  const intervalId = setInterval(() => {
    if (diff <= 0) {
      clearInterval(intervalId);
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);
    pageRefs.daysRef.textContent = addLeadingZero(days);
    pageRefs.hoursRef.textContent = addLeadingZero(hours);
    pageRefs.minutesRef.textContent = addLeadingZero(minutes);
    pageRefs.secondsRef.textContent = addLeadingZero(seconds);
    diff -= 1000;
  }, 1000);
}

pageRefs.buttonRef.addEventListener('click', startTimer);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

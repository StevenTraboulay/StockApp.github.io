var historyClick = false;

historyButton = document.querySelector('#stock-history-btn');

historyButton.addEventListener('click', function(event) {
  event.stopPropagation();
  historyButton.classList.toggle('is-active');
});
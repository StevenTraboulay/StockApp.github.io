historyButton = document.querySelector('#stock-history-btn');

historyButton.addEventListener('click', function(event) {
  event.stopPropagation();
  event.preventDefault();
  historyButton.classList.toggle('is-active');
});
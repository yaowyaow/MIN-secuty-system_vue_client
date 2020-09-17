export const outportData = {
    type: 'line',
    data: {
      labels: ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM', '12AM'],
      datasets: [
        { // one line graph
          label: 'Rate on out-port [Gbps]',
          data: [3,1.2,3,4.5,7.5,8.5,3],
          backgroundColor: [
            'rgba(237, 172, 68, 0.5)'
          ],
          borderColor: [
            '#36495d'
          ],
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      lineTension: 1,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            padding: 25,
          }
        }]
      }
    }
  }
  
  export default outportData;
  
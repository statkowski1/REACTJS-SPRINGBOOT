import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';

//const labels = ["January", "February", "March", "April", "May", "June"];

// const data = {
//   labels: labels,
//   datasets: [
//     {
//       label: "My First dataset",
//       backgroundColor: "rgb(255, 99, 132)",
//       borderColor: "rgb(255, 99, 132)",
//       data: [0, 10, 5, 2, 20, 30, 45],
//     },
//   ],
// };

const AdminStatistics = () => {

    const [Chart1, setChart1] = useState([]);
    const [Chart2, setChart2] = useState([]);
    const [Chart3, setChart3] = useState([]);
    const [Chart4, setChart4] = useState([]);
    const [Year, setYear] = useState(new Date().getFullYear());
    const actualYear = new Date().getFullYear();

    const labels = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    const colors = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
        "rgb(255, 159, 64)",
        "rgb(255, 0, 0)",
        "rgb(0, 255, 0)",
        "rgb(0, 0, 255)",
        "rgb(128, 128, 0)",
        "rgb(128, 0, 128)",
        "rgb(0, 128, 128)",
      ];

    useEffect(() => {
        getAllMonthEarningsInYear();
        getAllMonthSoldServicesInYear();
        getAllMonthEarningInYearReservation();
        getAllMonthReservationsInYear();
    }, [Year])
    
    const getAllMonthEarningsInYear = () => {
        axios.get('http://localhost:8080/charts/chart1', {params: {year: Year}}).then((response) => {
            setChart1(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getAllMonthSoldServicesInYear = () => {
        axios.get('http://localhost:8080/charts/chart2', {params: {year: Year}}).then((response) => {
            setChart2(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getAllMonthEarningInYearReservation = () => {
        axios.get('http://localhost:8080/charts/chart3', {params: {year: Year}}).then((response) => {
            setChart3(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getAllMonthReservationsInYear = () => {
        axios.get('http://localhost:8080/charts/chart4', {params: {year: Year}}).then((response) => {
            setChart4(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Roczne zarobki usług",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: Chart1,
            },
        ],
    };

    const data2 = {
        labels: labels,
        datasets: [
            {
            label: "Ilość sprzedanych usług",
            backgroundColor: "rgb(54, 162, 235)",
            borderColor: "rgb(54, 162, 235)",
            data: Chart2,
            },
        ],
    };

    const data3 = {
        labels: labels,
        datasets: [
            {
            label: "Roczne zarobki rezerwacji",
            backgroundColor: "rgb(0, 128, 0)",
            borderColor: "rgb(0, 128, 0)",
            data: Chart3,
            },
        ],
    };

    const data4 = {
        labels: labels,
        datasets: [
            {
                label: "Ilość dokonanych rezerwacji",
                backgroundColor: "rgb(128, 0, 128)",
                borderColor: "rgb(128, 0, 128)",
                data: Chart4,
            },
        ],
    };
    
    //   const renderChart = () => {
    //     switch (option) {
    //       case 1:
    //         return <Line data={data} style={{ height: "100%", width: "100%"}}/>;
    //       case 2:
    //         return <Bar data={data} />;
    //       case 3:
    //         return <Pie data={data2} options={option} style={{ height: "100%", width: "100%"}}/>;
    //       default:
    //         return null;
    //     }
    //   };

      const options = {
        maintainAspectRatio: false, // Ustawienie na false, aby wyłączyć utrzymanie proporcji
        responsive: true, // Ustawienie na true, aby wykres dostosowywał się do wielkości kontenera
      };

      const options2 = {
        legend: {
          position: 'right', // Tutaj ustawiasz położenie legendy, na przykład 'top', 'bottom', 'left', 'right'
          align: 'center', // Opcjonalne - wybierz 'start', 'center' lub 'end', aby dostosować dokładne położenie
        },
      };

  return (
    <div>
        <br/>
        <div class="container row row-cols-12">
            <div class="offset-2 col-1">
                <labels class="form-label">Podaj rok</labels>
            </div>
            <div class="col-2">
                <input
                    class="form-control"
                    type="number"
                    step="1"
                    min="1950"
                    max={actualYear}
                    value={Year}
                    onChange={(e) => setYear(e.target.value)}
                />
            </div>
        </div>
        <div class="container bg-dark-subtle mt-3 mb-3 rounded">
            {/* <div class="justify-content-center">
                <button class="btn btn-primary" onClick={handleChangeCharts}>Zmień Wykres</button>
            </div>
            <div class="row row-cols-12">
                <div class="container col-5 shadow border border-secondary-subtle bg-light rounded mb-4">{renderChart()}</div>
                <div class="container col-5 h-25 shadow border border-dark border-secondary-subtle rounded mb-4">{renderChart()}</div>
            </div> */}
            <br/>
            <div class="row row-cols-12">
                <div class="container col-5 shadow border border-secondary-subtle bg-light rounded mb-4">
                    <Line data={data} />
                </div>
                <div class="container col-5 shadow border border-secondary-subtle bg-light rounded mb-4">
                    <Bar data={data2} />
                </div>
            </div>
            <div class="row row-cols-12">
                <div class="container col-5 shadow border border-secondary-subtle bg-light rounded mb-4">
                    <Line data={data3} />
                </div>
                <div class="container col-5 shadow border border-secondary-subtle bg-light rounded mb-4">
                    <Bar data={data4}/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminStatistics;

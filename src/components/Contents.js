import { useState, useEffect } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import axios from 'axios'

const Contents = () => {

    const [confirmedData,setConfirmedData] = useState({});
    const [quarantinedData,setQuarantinedData] = useState({});
    const [comparedData,setComparedData] = useState({});

    useEffect(()=>{
        const fetchEvents = async() =>{
            //바로 변수에 할당하면 데이터를 다 불러오지 않는경우 호출하기 때문에 await 사용
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
            makeData(res.data);//데이터 형태 맞춰 안 넘지면 reduce 에러 발생
            console.log(res.data);
        }
        const makeData = (items)=>{
            //items.forEach(item=>console.log(item))
            const arr = items.reduce((acc,cur)=>{
                const itemDate = new Date(cur.Date);
                const year = itemDate.getFullYear();
                const month =  itemDate.getMonth();
                const date = itemDate.getDate();
                
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered = cur.Recovered;

                const findItem = acc.find(a=> a.year === year && a.month === month);

                if(!findItem){
                    acc.push({year,month,date,confirmed,active,death,recovered});
                }

                if(findItem && findItem.date < date){
                    findItem.active = active;
                    findItem.death = death;
                    findItem.date = date;
                    findItem.year = year;
                    findItem.month = month;
                    findItem.recoverd = recovered;
                    findItem.death = death;
                    findItem.confirmed = confirmed;
                }

                return acc;
            },[]);
            console.log(arr);
           const labels = arr.map(a => (a.month+1)+'월');
           setConfirmedData({
                labels : labels,
                datasets:[
                    {
                        label : "국내 누적 확진자",
                        backgroundColor : "salmon",
                        fill : true,
                        data : arr.map(a=>a.confirmed)
                    }
                ]
           });
           setQuarantinedData({
                labels : labels,
                datasets:[
                    {
                        label : "월별 격리자 현황",
                        borderColor : "salmon",
                        fill : false,
                        data : arr.map(a=>a.active)
                    }
                ]
           }) 
           const last = arr[arr.length -1];
           setComparedData({
                labels : ["확진자","격리해제","사망"],
                datasets:[
                    {
                        label : "누적확진, 해제 ,사망비율",
                        backgroundColor :["#ff3d67","#059bff","#ffc233"],
                        borderColor : ["#ff3d67","#059bff","#ffc233"],
                        fill : false,
                        data : [last.confirmed, last.recovered,last.death]
                    }
                ]
            }) 


        }
        fetchEvents()
    },[])//,[] 두번째 디펜전시를 줘야 반복호출을 박을수 있다.

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className="contents">
                <div>
                    <Bar data={confirmedData} options={
                        {title:{display:true,text:"누적확진자 추이",fontSize:16}},
                        {legend :{display:true, position : "bottom"}}
                    } />
                </div>
                <div>
                    <Line data={quarantinedData} options={
                        {title:{display:true,text:"월별 격리자 데이터",fontSize:16}},
                        {legend :{display:true, position : "bottom"}}
                    } />
                </div>
                <div>
                    <Doughnut data={comparedData} options={
                        {title:{display:true,text:`누적, 확진 ,해제, 사망 (${new Date().getMonth+1}월)`,fontSize:16}},
                        {legend :{display:true, position : "bottom"}}
                    } />
                </div>
            </div>
        </section>
    )
}

export default Contents

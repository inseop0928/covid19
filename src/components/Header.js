//import React from 'react'
import React,{ useState, useEffect } from 'react'

const Header = () => {
    
    //const [contentType,setContentType] = useState({});
    //let [contentType,chgContentType]  = useState(['남자코트','강남 우동'])

    const onContentType = (data) =>{

        if(data.target.value === "Y"){
            console.log("국내")

        }else{
            console.log("국외")
        }
    }

    return (
        <header className="header">
            <h1>COVID-19</h1>
            <select onChange={onContentType}>
                <option value = "Y">국내</option>
                <option value = "N">세계</option>
            </select>
        </header>
    )
}

export default Header

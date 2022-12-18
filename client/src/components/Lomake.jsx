import React from 'react'
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { Button, DialogContent, Stack } from '@mui/material';
import { fiFI } from '@mui/x-date-pickers/locales';
import fi from 'dayjs/locale/fi';
import { useState } from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import { Context } from '../App';

export const Lomake = () => {

    const {log, setLog, haeData} = useContext(Context)

    const [fillerData, setFillerData] = useState([]);

    const [ajankohta, setAjankohta] = useState({
        alku : new Date(),
        loppu : new Date()
    })

    const formRef = useRef();

    const laheta = async (e) => {

        e.preventDefault()
        
        try {
      
          const yhteys = await fetch("http://localhost:3001/", {
              method : "POST",
              headers : {
                  "Content-Type" : "application/json"
              },
              body : JSON.stringify({
                  nimi : formRef.current.nimi.value,
                  alku : ajankohta.alku,
                  loppu : ajankohta.loppu,
                  kcal : formRef.current.kcal.value
              })
          });

          const success = await yhteys.json();
          setLog([...log, success])
          haeData()
    
        } catch (e) {
            console.log(e)
        }
      }

      const luoData = async () => {
        let luotuData = [];

        let aktiviteetit = [
            "Jalkapallo",
            "Kalastus",
            "Kuntosali",
            "Hiihto",
            "Uinti",
            "Suunnistus",
            "Ämmänkanto",
            "Sulkapallo",
            "Tennis",
            "Padel",
            "Koripallo",
            "Miekkailu",
            "Kendo",
            "Ammunta",
            "Laskettelu"
        ]

        for(let i = 1000; i !== 0; i--){
            let randomAlku = new Date(Math.random() * (new Date().getTime() - (new Date().getTime() - 31556952000 * 3) + (new Date().getTime() - 31536000000 * 3)))
            let randomLoppu = new Date(randomAlku.getTime() + (Math.random() * (3600000 * 3 - 3600000) + 3600000))

            luotuData = [...luotuData, {
                nimi : aktiviteetit[Math.floor(Math.random() * aktiviteetit.length)],
                alku : randomAlku,
                loppu : randomLoppu,
                kcal : Math.floor(Math.random() * 1000)
            }]
        }
        
        try {
      
            const yhteys = await fetch("http://localhost:3001/many", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    data : luotuData
                })
            });
  
            const success = await yhteys.json();
            setLog([...log, success])
            haeData()
      
          } catch (e) {
              console.log(e)
          }
      }  


  return (

<DialogContent>
    <Button onClick={() => luoData()}>GENEROI DATA</Button>
    <Stack sx={{margin:"auto"}} component={"form"} spacing={1.5} maxWidth={500} ref={formRef} onSubmit={laheta} method='POST'>

        <TextField
        name="nimi"
        label="Suoritettu aktiviteetti"
        />

        <LocalizationProvider adapterLocale={"fi"} dateAdapter={AdapterDayjs}>
        <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Alkamisajankohta"
            value={ajankohta.alku}
            onChange={(newValue) => {
            setAjankohta({...ajankohta, alku : newValue});
            }}
        />

        <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Lopetusajankohta"
            value={ajankohta.loppu}
            onChange={(newValue) => {
            setAjankohta({...ajankohta, loppu : newValue});
            }}
        />
        </LocalizationProvider>

        <TextField
        name="kcal"
        label="Poltetut kalorit"
        type={"number"}
        />

        <Button variant="contained" type='submit'>Lähetä</Button>
    </Stack>
</DialogContent>
  )
}

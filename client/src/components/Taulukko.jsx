import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import DoneIcon from '@mui/icons-material/Done';
import { Context } from '../App';
import { useContext } from 'react';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Button, DialogContent, Stack } from '@mui/material';
import { fiFI } from '@mui/x-date-pickers/locales';
import fi from 'dayjs/locale/fi';

export default function Taulukko() {

  const {log, setLog, haeData} = useContext(Context)
  var localizedFormat = require('dayjs/plugin/localizedFormat')
  dayjs.extend(localizedFormat)

  const [muokkaustila, setMuokkaustila] = useState({
    auki : false,
    id : "",
    nimi : "",
    alku : new Date(),
    loppu : new Date(),
    kcal : 0,
  })

  const poista = async (id) => {

    try {
      
      const yhteys = await fetch("http://localhost:3001/", {
          method : "DELETE",
          headers : {
              "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            _id : id
          })
      });

      const success = await yhteys.json();
      setLog([...log, success])
      haeData()

    } catch (e) {
        console.log(e)
    }
  }

  const muokkaa = async () => {

    try {
      
      const yhteys = await fetch("http://localhost:3001/", {
          method : "PUT",
          headers : {
              "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            _id : muokkaustila.id,
            nimi : muokkaustila.nimi,
            alku : muokkaustila.alku,
            loppu : muokkaustila.loppu,
            kcal : muokkaustila.kcal
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
    <TableContainer component={Paper} sx={{maxWidth: 960, margin:"auto"}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Aktiviteetti</TableCell>
            <TableCell align="right">Alkamisajankohta</TableCell>
            <TableCell align="right">Lopetusajankohta</TableCell>
            <TableCell align="right">Poltetut kalorit (kcal)</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {log.map((row, idx) => (
              <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              > 
              <TableCell component="th" scope="row">
                {
                  (muokkaustila.auki && muokkaustila.id === row._id)
                  ? <TextField placeholder={row.nimi} onBlur={(e) => setMuokkaustila({...muokkaustila, nimi : e.target.value})}/>
                  : <>{row.nimi}</>
                }
              </TableCell>

              <LocalizationProvider adapterLocale={"fi"} dateAdapter={AdapterDayjs}>
                <TableCell align="right">
                  {
                    (muokkaustila.auki && muokkaustila.id === row._id)
                    ?<DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Alkamisajankohta"
                      value={muokkaustila.alku}
                      onChange={(newValue) => {
                      setMuokkaustila({...muokkaustila, alku : newValue});
                    }}/>
                    : <>{dayjs(row.alku).format("DD.MM.YYYY hh:mm")}</>
                  }
                </TableCell>

                <TableCell align="right">
                  {
                    (muokkaustila.auki && muokkaustila.id === row._id)
                    ? <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Loppumisajankohta"
                    value={muokkaustila.loppu}
                    onChange={(newValue) => {
                    setMuokkaustila({...muokkaustila, loppu : newValue});
                  }}/>
                    : <>{dayjs(row.loppu).format("DD.MM.YYYY hh:mm")}</>
                  }
                </TableCell>
              </LocalizationProvider>

              <TableCell align="right">
                {
                  (muokkaustila.auki && muokkaustila.id === row._id)
                  ? <TextField type={"number"} placeholder={row.kcal} onBlur={(e) => setMuokkaustila({...muokkaustila, kcal : e.target.value})}/>
                  : <>{row.kcal}</>
                }
              </TableCell>
              <TableCell align="right">
                {
                  (muokkaustila.auki && muokkaustila.id === row._id)
                  ?<>
                  <IconButton onClick={() => setMuokkaustila(
                    {...muokkaustila, auki : false, id : "", nimi: "", alku : new Date(), loppu: new Date(), kcal: 0})}><DoDisturbIcon/></IconButton>
                  <IconButton onClick={() => {muokkaa(); setMuokkaustila(
                    {...muokkaustila, auki : false, id : "", nimi: "", alku : new Date(), loppu: new Date(), kcal: 0})}}><DoneIcon/></IconButton>
                  </>

                  :<>
                  <IconButton onClick={() => poista(row._id)}><ClearIcon/></IconButton>
                  <IconButton onClick={() => setMuokkaustila({...muokkaustila, auki : true, id : row._id, 
                    nimi: row.nimi, alku : row.alku, loppu: row.loppu, kcal: row.kcal})}><EditIcon/></IconButton>
                  </>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

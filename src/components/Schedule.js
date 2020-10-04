import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, Badge } from "shards-react";
import { Container, Row, Col } from 'shards-react';
import firebase from '../firebase'

const database = firebase.database();
export default function Schedule(props){

    let [timeSettings, setTimeSettings] = useState({start:0, end: 0, num : 0})
    let [events, setEvents] = useState(null)
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"]

    useEffect(() => {
        if(props.user)
            getEvents(props.user)
    },[])

    async function getEvents(user) {
        let newEvents = {}

        //init schedule slots
        let settings = await database.ref('users/' + user.uid + '/settings').once('value');
        if(!settings.exists()) return;

        let startTime = settings.val().start_time.split(":")
        let endTime = settings.val().end_time.split(":")
        startTime = parseFloat(startTime[0]) + (parseFloat(startTime[1])/60)
        endTime = parseFloat(endTime[0]) + (parseFloat(endTime[1])/60)
        const numSlots = (endTime - startTime)*2
        console.log(startTime, endTime, numSlots)
        setTimeSettings({
            start: startTime, 
            end: endTime,
            num: numSlots
        })

        for(let weekday of weekdays){
            if(!newEvents[weekday])
                newEvents[weekday] = {}
            newEvents[weekday]['events'] = [...Array(numSlots)].fill({})
        }
        console.log(newEvents)

        let res = await props.calendar.getCalendar()

        Object.keys(res).forEach(calendar => {
            if(res[calendar]){
                res[calendar].forEach(e => {
                    const start = new Date(e.start.dateTime)
                    const end = new Date(e.end.dateTime)
                    const startHours = start.getHours()
                    const endHours = end.getHours()

                    if(!newEvents[weekdays[start.getDay()-1]]["date"]){
                        newEvents[weekdays[start.getDay()-1]]["date"] = start.toLocaleDateString()
                    }

                    const index = (startHours - startTime) * 2 
                    const len = (endHours - startHours) * 2
                    for(let i = index; i <= len+index; i++) {
                        newEvents[weekdays[start.getDay()-1]]['events'][i] = {
                            start: start,
                            end: end,
                            id: e.id,
                            name: e.summary,
                            des: e.description,
                            tag: calendar,
                            amtTime: len,
                            ext: (i !== index) ? true : false
                        }
                    }
                })
            }
        })
        console.log(newEvents)
        setEvents(newEvents)
    }

    return(
        <div className="schedule">
            {/* <Container style={{width: '100%'}}> */}
                <Row style={{width: "150%"}}>
                    <Col md="2">
                        <h4>Time</h4>
                        <p>24 hour clock</p>
                        {
                            [...Array(timeSettings.num)].map((a, index) => {
                                const hours = (timeSettings.start + (index*0.5))
                                const onlyHour = Math.floor(hours)
                                const str = onlyHour.toString() + ":" + ((hours-onlyHour) * 6).toString() + '0'
                                return <div className="event">
                                    <h3>{str}</h3>
                                </div>
                            })
                        }
                    </Col>
                    { 
                        events && 
                        Object.keys(events).map(weekday => {
                            return <Col md="2" key={weekday}>
                                <h4>{weekday}</h4>
                                <p>{events[weekday]["date"] ? events[weekday]["date"] : 'Date'}</p>
                                {events[weekday]["events"].map(e => {
                                    if(e.id) {
                                        const height = e.amtTime*75
                                        return <div className="event">
                                            {!e.ext &&
                                            <Card style={{height: height + 'px'}}>
                                                <CardBody>
                                                    <CardSubtitle>{e.name}</CardSubtitle>
                                                    {e.des}
                                                    <Badge theme={e.tag === "primary" ? "primary" : "success"}>{e.tag}</Badge>
                                                </CardBody>
                                            </Card>}
                                        </div>
                                    }else {
                                        return <div className="event"/>
                                    }
                                })}
                            </Col>
                        })
                    }
                </Row>
            {/* </Container> */}
        </div>
    )
}
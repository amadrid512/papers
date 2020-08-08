import React from 'react'
import {Menubar} from 'primereact/menubar'
import {Button} from 'primereact/button'
import {navigate} from "@reach/router"
import { FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"


export function MainMenu() {

    const items= [
        {
            label:'Home',
            icon:'pi pi-fw pi-home',
            // command: () => navigate('./listpage') 
            command: () => navigate('/') 
        },
        {
            label:'Abstracts',
            icon:'pi pi-clone',
            // command: () => navigate('/pmc/PMCMonthOverMonth') 
        },
        {
            label:'Authors',
            icon:'pi pi-users',
            // command: () => navigate('/pmc/PMCEmpQualityMeasures') 
        },
        {
            label:'Studies',
            icon:'pi pi-file-o',
            // command: () => navigate('/pmc/PMCEmpQualityMeasures') 
        },
    ]
    return( 
        <Menubar model={items}>
           
        </Menubar>
        // <InputText placeholder="Search" type="text"/>  Put inside Menubar if want to implement a search option cjb - 07/10/209
    )

}
export default MainMenu


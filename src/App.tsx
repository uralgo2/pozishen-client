import React, {useEffect, useState} from 'react'
import Header from "./components/Header"
import Queries from "./components/Queries";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Projects from "./components/Projects";
import ProjectsCreate from "./components/Projects.Create";
import {IProject, IUser} from "./types";
import {Api} from "./api";
import {useLocation} from "react-router";
import MainPage from "./components/MainPage";
import Footer from "./components/Footer";
import './resources/styles/main.css'
import Sidebar from "./components/Sidebar";
import ProjectsUpdate from "./components/Projects.Update";
import Positions from "./components/Positions";

function App() {
    const [user, setUser] = useState<IUser | null>({
        accountCreatedAt: new Date(),
        balance: 0,
        discount: 0,
        email: "",
        executedTasksForDay: 0,
        executedTasksForMonth: 0,
        executedTasksForWeek: 0,
        id: 0,
        loadLimit: 0,
        maxResourceLimit: 0
    })
    const [projects, setProjects] = useState<IProject[]>([])
    const [modal, setModal] = useState<string | null>(null)
    const [menuOpened, setMenuOpened] = useState(false)

    const location = useLocation()

    const fetchUser = async () => {
        const _user = await Api.GetMe()

        if ("message" in _user)
            return setUser(null)


        _user.balance = Number(_user.balance)

        setUser(_user)
    }

    const fetchProjects = async () => {
        const _projects = await Api.GetProjects()

        if ("message" in _projects)
            return

        _projects.forEach(project => {
            project.marker = 'green'
            if (project.lastCollection as any as string == '-') {
                project.lastCollection = null
            }
            else
                project.lastCollection = new Date(project.lastCollection as any as string)
        })
        setProjects(_projects)
    }

    useEffect(() => {
        fetchUser()
        fetchProjects()
    }, [location.pathname])
    return (
        <div className="app">
            <Routes>
                <Route path='/' element={<>
                    <Header menuOpened={menuOpened} setMenuOpened={setMenuOpened} modal={modal} setModal={setModal} user={user} projects={projects} setProjects={setProjects}/>
                    <MainPage modal={modal} setModal={setModal}/>
                    <Footer/>
                </>}/>
                {
                    user &&
                  <>
                    <Route path={'*'} element={<Navigate to='/projects'/>}/>
                    <Route path='/queries' element={<>
                        <Header menuOpened={menuOpened} setMenuOpened={setMenuOpened} modal={modal} setModal={setModal} user={user} projects={projects} setProjects={setProjects}/>
                        <Queries/>
                    </>}/>
                    <Route path='/projects/create' element={<>
                        <Header menuOpened={menuOpened} setMenuOpened={setMenuOpened} modal={modal} setModal={setModal} user={user} projects={projects} setProjects={setProjects}/>
                        <ProjectsCreate/>
                    </>}/>
                    <Route path='/projects/update' element={<>
                        <Header menuOpened={menuOpened} setMenuOpened={setMenuOpened} modal={modal} setModal={setModal} user={user} projects={projects} setProjects={setProjects}/>
                        <ProjectsUpdate/>
                    </>}/>
                    <Route path='/projects' element={<>
                        <Header menuOpened={menuOpened} setMenuOpened={setMenuOpened} modal={modal} setModal={setModal} user={user} projects={projects} setProjects={setProjects}/>
                        <Projects projects={projects} setProjects={setProjects}/>
                    </>
                    }/>
                    <Route path='/positions/*' element={<>
                        <Positions/>
                    </>}/>
                  </>
                }
                {
                    !user &&
                    <Route path='*' element={<Navigate to='/' />}/>
                }
            </Routes>
        </div>
    );
}

export default App;

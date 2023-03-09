//React Imports:
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useResolvedPath, useNavigate, useMatch, Link, Outlet } from "react-router-dom";

//Firebase:
import { auth, db } from "../firebase-config";
import { httpsCallable, getFunctions } from "firebase/functions";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword} from "firebase/auth"; 

import GetUserBalance from "../Functions/GetBalance";

//Style:
import LogIn from "./LogIn";
import CreateAccount from "./CreateAccount";

import Icon from "@mdi/react";
import "./CompStyles/NavbarStyles.css"; 
import { mdiChevronDown, mdiChevronUp, mdiTarget, mdiWalletPlus } from "@mdi/js";
import { Button, ButtonGroup, Heading, Menu, MenuButton, MenuList, MenuItem, useDisclosure} from "@chakra-ui/react";



export default function NavBar() {

    //State:
    const auth = getAuth(); 
    const navigate = useNavigate();
    const [user, setUser] = useState(null); 

    useEffect(() => {
        
        const loggedIn = auth.onAuthStateChanged((authUser) => {

            if (auth.currentUser != undefined) {
                setUser(authUser); 
            } else {
                setUser(null);
                navigate("/"); 
            }
        });

        return (loggedIn()); 
    },[]);
    
    //------------------------------------------------------------------


    const LogOut = async () => {

        if (!auth.currentUser) {
            alert("Can not log out when you are not logged in"); 
            return; 
        }

        signOut(auth).then(() => {
            window.location.reload(); 

        }).catch ((error) => {
            console.log("An error occcured while logging out" + error); 
        });
    }   

    
    const SignAction = () => {

        const { isOpen, onOpen, onClose } = useDisclosure()
        const arrow = isOpen ? <Icon path={mdiChevronUp} size={1}/> : <Icon path={mdiChevronDown} size={1}/>

        return (
            <Menu>
                <MenuButton isActive={isOpen} as={Button} rightIcon = {arrow}>
                    Score Scope
                </MenuButton>

                <MenuList>

                    <MenuItem>
                        <p>Log Out</p>
                    </MenuItem>

                    <MenuItem>
                        <p>Log In</p>
                    </MenuItem>

                    <MenuItem>
                        <p>Create Account</p>
                    </MenuItem>
                    
                </MenuList>
            </Menu>
        )  
    }

    

    //------------------------------------------------------------------

    function CustomLink({ to, children }) {
        const resolvedPath = useResolvedPath(to);
        const isActive = useMatch({ path: resolvedPath.pathname, end : true});
    
        return (
            <li className= {isActive ? "active" : ""}>
                <Link to={to}>{children}</Link>
            </li>   
        );
    }

    //------------------------------------------------------------------

    //Main Nav Return:

    return (

        <div className = "nav">

            
            <div className = "nav-section">
                <SignAction/>
                <Button rightIcon = {<Icon path = {mdiWalletPlus} size = {1}/>}>Deposit</Button>
            </div>

            <div className = "nav-section">

                <CustomLink to = "/">
                    <Button>Parlay</Button>
                </CustomLink>

                <CustomLink to = "/versus">
                    <Button>Versus</Button>
                </CustomLink>

                <CustomLink to = "/stats">
                    <Button>Stats</Button>
                </CustomLink>

                <CustomLink to = "/leaderboards">
                    <Button>Leaderboard</Button>
                </CustomLink>

                <CustomLink to = "/profile">
                    <Button>Profile</Button>
                </CustomLink>
            </div>

        </div>
    ); 
}


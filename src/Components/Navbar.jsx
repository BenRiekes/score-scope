//React Imports:
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useResolvedPath, useNavigate, useMatch, Link, Outlet } from "react-router-dom";

//Firebase:
import { auth, db } from "../firebase-config";
import { httpsCallable, getFunctions } from "firebase/functions";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword} from "firebase/auth"; 

import { getUserBalance, getUserAddress} from "../Functions/GetBalance";


//Style:
import LogIn from "./LogIn";
import CreateAccount from "./CreateAccount";

import Icon from "@mdi/react";
import "./CompStyles/NavbarStyles.css"; 

import { 
    mdiChevronDown, mdiChevronUp, 
    mdiTarget, mdiWalletPlus 
} from "@mdi/js";

import { 
    Button, ButtonGroup, Heading, Menu, 
    MenuButton, MenuList, MenuItem, useDisclosure, Divider, VStack, StackDivider
} from "@chakra-ui/react";



export default function NavBar() {

    //State:
    const auth = getAuth(); 
    const navigate = useNavigate();

    const [user, setUser] = useState(null); 
    const [userBalance, setUserBalance] = useState('?');


    useEffect(() => {
        if (user != null) {
            setUserBalance(
                getUserBalance(auth.currentUser.uid)
            );
        }
    }, [user]);
   
    
    auth.onAuthStateChanged((response) => {
        if (auth.currentUser != undefined) {
            setUser(response); 
        }
    });

   
    //------------------------------------------------------------------

    const handleLogOut = async () => {

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

    //------------------------------------------------------------------

    const SignAction = () => {

        const { isOpen, onOpen, onClose } = useDisclosure()
        const arrow = isOpen ? <Icon path={mdiChevronUp} size={1}/>: <Icon path={mdiChevronDown} size={1}/>
        
        const handleMenu = () => {

            if (isOpen === true) {
                onClose(); 
            } else {
                onOpen();
            }
        }

        //------------------------------------------------------------------

        return (
            <Menu>  
                <MenuButton 
                    as={Button} isActive={isOpen} rightIcon = {arrow} onClick = {handleMenu}
                >
                    <Heading size = 'md' style = {{color: 'black'}}>Score Scope</Heading>
                </MenuButton>

                <MenuList>
                    <MenuItem>
                        {auth.currentUser === null ? (

                            <VStack
                                divider={<StackDivider borderColor='gray.200' />}
                                spacing = {2}
                                align = 'flex-start'
                            >
                                <LogIn/>
                                <CreateAccount />
                            </VStack>
                           
                        ) : ( 
                            <Button onClick = {handleLogOut}>Log Out</Button>
                        )}
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

    return (

        <div className = "nav">

            <div className = "nav-section">
                <SignAction/>

                <Button rightIcon = {<Icon path = {mdiWalletPlus} size = {1}/>}>
                    Deposit
                </Button>
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
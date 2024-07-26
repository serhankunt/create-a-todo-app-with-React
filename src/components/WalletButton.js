import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { createUser } from "@/api/createUser";
import { acquireSessionToken } from "@/api/acquireSessionToken";
import { initializeUser } from "@/api/initializeUser";
import { getAppId } from "@/api/getAppId";

const StyledButton = styled.button`
  background-color: white;
  border: none;
  cursor: pointer;
  padding: 1rem;
  transition: all 0.3s ease;
  &:hover {
    background: rgb(65, 65, 65);
    color: white;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  z-index: 9;
  top: 1rem;
  right: 1rem;
  background-color: white;
  box-shadow: 2px 2px 50px rgb(204, 204, 204);
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.5s ease;
  opacity: 1;
  @media screen and (max-width: 760px) {
    top: 0.5rem;
    right: 0.5rem;
  }
`;

const FormContainer = styled.div`
  padding: 1rem;
  background-color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const WalletButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [appId, setAppId] = useState("");
  const [userToken, setUserToken] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [sdk, setSdk] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSdk(new W3SSdk());
    // const sdkInstance = new W3SSdk();
    // setSdk(sdkInstance);
    // console.log(sdkInstance);
  }, []);

  const fetchData = useCallback(async () => {
    console.log("deneme"); // Test için eklendi
    setLoading(true);
    try {
        const appIdResult = await getAppId();
      const userResult = await createUser();
      const sessionResult = await acquireSessionToken();
      const challengeResult = await initializeUser();

      if (userResult && sessionResult && challengeResult && appIdResult) {
        console.log("if içi deneme satırı")
        console.log(appIdResult);
        setAppId(appIdResult);
        setUserToken(sessionResult.userToken);
        setEncryptionKey(sessionResult.encryptionKey);
        setChallengeId(challengeResult);
        
        console.log("Fetched data:", {
          appId : appIdResult.appId,
          userId: userResult.userId,
          userToken: sessionResult.userToken,
          encryptionKey: sessionResult.encryptionKey,
          challengeId: challengeResult,
        });
      }
      else if(!userResult){
        console.log("User result");
      }else if(!sessionResult){
        console.log("Session result");
      }else if(!challengeResult){
        console.log("challenge result");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onAppIdChange = useCallback((e) => setAppId(e.target.value), []);
  const onUserTokenChange = useCallback((e) => setUserToken(e.target.value), []);
  const onEncryptionKeyChange = useCallback((e) => setEncryptionKey(e.target.value), []);
  const onChallengeIdChange = useCallback((e) => setChallengeId(e.target.value), []);

  const handleSubmit = useCallback(() => {
    if (sdk) {
      sdk.setAppSettings({ appId });
      sdk.setAuthentication({ userToken, encryptionKey });

      sdk.execute(challengeId, (error, result) => {
        if (error) {
          console.log(`${error?.code?.toString() || 'Unknown code'}: ${error?.message ?? 'Error'}`);
          return;
        }
        console.log(`Challenge: ${result.type}`);
        console.log(`Status : ${result.status}`);

        if (result.data) {
          console.log(`signature: ${result.data?.signature}`);
        }
      });
    }
    setShowForm(false);
  }, [sdk, appId, userToken, encryptionKey, challengeId]);

  const handleShowForm = useCallback(() => {
    setShowForm(true);
    fetchData();
  }, [fetchData]);

  return (
    <ButtonContainer>
      {!showForm ? (
        <StyledButton onClick={handleShowForm}>Create Wallet</StyledButton>
      ) : loading ? (
        <FormContainer>Loading...</FormContainer>
      ) : (
        <FormContainer>
          <Input type="text" placeholder="APP ID" value={appId} onChange={onAppIdChange} />
          <Input type="text" placeholder="User Token" value={userToken} onChange={onUserTokenChange} />
          <Input type="text" placeholder="Encryption Key" value={encryptionKey} onChange={onEncryptionKeyChange} />
          <Input type="text" placeholder="Challenge ID" value={challengeId} onChange={onChallengeIdChange} />
          <StyledButton onClick={handleSubmit}>Verify Challenge</StyledButton>
          <StyledButton onClick={() => setShowForm(false)}>Cancel</StyledButton>
        </FormContainer>
      )}
    </ButtonContainer>
  );
};

export default WalletButton;




// import React,{useState,useCallback} from "react";
// import styled from "styled-components";
// import {W3SSdk} from "@circle-fin/w3s-pw-web-sdk";
// import { createUser } from "@/api/createUser";
// import { acquireSessionToken } from "@/api/acquireSessionToken";
// import {initializeUser} from "@/api/initializeUser";

// const StyledButton = styled.button`
// background-color:white;
// border:none;
// cursor:pointer;
// padding:1rem;
// transition: all 0.3s ease;
// &:hover{
// background:rgb(65,65,65);
// color:white
// }
// `

// const ButtonContainer = styled.div`
// position:fixed;
// z-index:9;
// top:1rem;
// right:1rem;
// background-color:white;
// box-shadow: 2px 2px 50px rgb(204,204,204);
// border-radius:5px;
// overflow:hidden;
// transition: all 0.5s ease;
// opacity:1;
// @media screen and (max-width:760px){
// top:0.5rem;
// right:0.5rem;
// }
// `

// const FormContainer = styled.div`
// padding:1rem;
// background-color:white;
// `;

// const Input = styled.input`
// width:100%;
// padding:0.5rem;
// margin-bottom:0.5rem;
// `;

// const WalletButton =() =>{
// const [showForm , setShowForm] = useState(false);
// const [appId,setAppId] = useState('');
// const [userToken, setUserToken] = useState('');
// const [encryptionKey,setEncryptionKey] = useState('');
// const [challangeId,setChallengeId] = useState('');
// const [sdk, setSdk] = useState(null);

// useState(()=>{
//     setSdk(new W3SSdk());
// },[]);

// const onAppIdChange = useCallback((e)=> setAppId(e.target.value),[]);
// const onUserTokenChange = useCallback((e)=> setUserToken(e.target.value),[]);
// const onEncryptionKeyChange = useCallback((e)=> setEncryptionKey(e.target.value),[]);
// const onChallengeIdChange = useCallback((e)=> setChallengeId(e.target.value),[]);

// const handleSubmit = useCallback(()=>{
//     if(sdk){
//         sdk.SetAppSettings({appId});
//         sdk.setAuthentication({userToken,encryptionKey});

//         sdk.execute(challangeId,(error,result)=>{
//             if(error){
//                 console.log(`${error?.code?.toString() || 'Unknown code'}: ${error?.message ?? 'Error'}`);
//                 return;
//             }
//             console.log(`Challenge: ${result.type}`);
//             console.log(`Status : ${result.status}`);

//             if(result.data){
//                 console.log(console.log(`signature: ${result.data?.signature}`));
//             }
//         });
//     }
//     setShowForm(false);
// },[sdk,appId,userToken,encryptionKey,challangeId]);

// return(
//     <ButtonContainer>
//         {!showForm ? (<StyledButton onClick={()=> setShowForm(true)}>Create Wallet</StyledButton>)
//         :(
//             <FormContainer>
//                 <Input type="text" placeholder="APP ID" value={appId} onChange={onAppIdChange}/>
//                 <Input type="text" placeholder="User Token" value={userToken} onChange={onUserTokenChange}/>
//                 <Input type="text" placeholder="Encryption Key" value={encryptionKey} onChange={onEncryptionKeyChange}/>
//                 <Input type="text" placeholder="Challenge ID" value={challangeId} onChange={onChallengeIdChange}/>
//                 <StyledButton onClick={handleSubmit}>Verify Challenge</StyledButton>
//                 <StyledButton onClick={()=> setShowForm(false)}>Cancel</StyledButton>
//             </FormContainer>
//         )}
//     </ButtonContainer>
// )
// };


// // const WalletButton = () =>{
// // const [isCreating,setIsCreating] = useState(false);
// // const handleCreateWallet = async()=>{
// //     setIsCreating(true);
// //     try{
// //         const result = await createUser();
// //         const sessionResult = await acquireSessionToken();
// //         const challangeId = await initializeUser();
       
// //         if(result && sessionResult && challangeId ){
// //             console.log("User created successfully. User ID:",result.userId);
// //             console.log("User Token:",sessionResult.userToken);
// //             console.log("Encryption Key:",sessionResult.encryptionKey);
// //             console.log("User initialize successfully.ChallengeId: ",challangeId);
// //         }else if(!result){
// //             console.log("User creation failed!");
// //         }else if(!sessionResult){
// //             console.log("Failed session token!");
// //         }else if(!challangeId){
// //             console.log("Failed challengeId");
            
// //         }
// //         else{
// //             console.error("Failed");
// //         }
// //     }catch(error){
// //         console.error("Error in wallet creation process:",error);
// //         console.log(error);
// //     }finally{
// //         setIsCreating(false);
// //     }
// // };

// //     return (
// //         <ButtonContainer>
// //             <StyledButton onClick={handleCreateWallet} disabled={isCreating}>
// //                 {isCreating ? 'Creating...' : 'Create Wallet'}
// //             </StyledButton>
// //         </ButtonContainer>
        
// //     );
// // }

// export default WalletButton;
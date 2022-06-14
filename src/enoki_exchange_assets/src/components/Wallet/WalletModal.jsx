import React from "react";
import {useDispatch} from "react-redux";
import useLogin from "../../hooks/useLogin";
import {canisterId as canisterIdA} from "../../../../declarations/enoki_wrapped_token";
import {canisterId as canisterIdB} from "../../../../declarations/enoki_wrapped_token_b";
import useTokenBalance from "../../hooks/useTokenBalance";
import {bigIntToStr} from "../../utils/utils";
import ComingSoon from "../shared/ComingSoon";
import getMainToken from "../../actors/getMainToken";
import getTokenShard from "../../actors/getTokenShard";
import {setTradeOccurred} from "../../state/lastTradeSlice";
import LoadingText from "../shared/LoadingText";

const Wallet = ({toggleShowWallet}) => {
  let {logout, getIdentity} = useLogin();
  const dispatch = useDispatch();

  const balanceEIcp = useTokenBalance({principal: canisterIdA});
  const balanceEXtc = useTokenBalance({principal: canisterIdB});
  console.log({balanceEIcp, balanceEXtc});
  const balanceEIcpStr = balanceEIcp !== null && bigIntToStr(balanceEIcp, 'eICP', 6, null);
  const balanceEXtcStr = balanceEXtc !== null && bigIntToStr(balanceEXtc, 'eXTC', 4, null);
  console.log({balanceEIcpStr, balanceEXtcStr});

  const [mintingA, setMintingA] = React.useState(false);
  const [mintingB, setMintingB] = React.useState(false);

  const mintA = () => {
    setMintingA(true);
    mint(canisterIdA, () => setMintingA(false));
  }

  const mintB = () => {
    setMintingB(true);
    mint(canisterIdB, () => setMintingB(false));
  }

  const mint = (principal, cb) => {
    getMainToken(getIdentity(), principal)
      .getAssignedShardId(getIdentity().getPrincipal())
      .catch(() => getMainToken(getIdentity(), principal)
        .register(getIdentity().getPrincipal())
      )
      .then(assignedShard => getTokenShard(getIdentity(), assignedShard).mint(BigInt("1000000000000000")))
      .catch(e => console.error(e))
      .then(() => {
        cb();
        dispatch(setTradeOccurred());
      })
  }

  const clickLogout = () => {
    toggleShowWallet();
    logout();
  }

  return (
    <div className="wallet-modal">
      <div className="overlay" onClick={() => toggleShowWallet()}></div>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4>Wallet</h4>
            <a style={{cursor: "pointer"}} onClick={() => clickLogout()}>Disconnect Wallet</a>
          </div>
          <div className="modal-body">
            <div className="box">
              <h5>Tokens</h5>
              <div className="icon_box">
                <img className="icon" src="img/i15.png" alt=""/>
                <div className="content">
                  <p><b>0.0</b> ICP</p>
                  <button className="btn"><img src="img/i17.png" alt=""/> BOOST</button>
                </div>
              </div>
              <div className="icon_box">
                <img className="icon" src="img/i16.png" alt=""/>
                <div className="content">
                  <p><b>0.0</b> XTC</p>
                  <button className="btn" data-bs-toggle="modal" data-bs-target="#boost-modal"><img
                    src="img/i17.png" alt=""/> BOOST
                  </button>
                </div>
              </div>
              <ComingSoon customStyle={{width: "50%"}}/>
            </div>
            <div className="box">
              <h5>Enoki-Boosted Tokens</h5>
              <div className="icon_box">
                <img className="icon" src="img/i13.png" alt=""/>
                <div className="content">
                  <p><b>{balanceEIcpStr !== null ? balanceEIcpStr : "--"}</b> eICP</p>
                  {
                    mintingA ? (
                      <button className="btn" data-bs-toggle="modal" data-bs-target="#unboost-modal"><LoadingText text="MINTING"/></button>
                    ) : (
                      <button onClick={() => mintA()} className="btn" data-bs-toggle="modal" data-bs-target="#unboost-modal">MINT</button>
                    )
                  }
                </div>
              </div>
              <div className="icon_box">
                <img className="icon" src="img/i14.png" alt=""/>
                <div className="content">
                  <p><b>{balanceEXtcStr !== null ? balanceEXtcStr : "--"}</b> eXTC</p>
                  {
                    mintingB ? (
                      <button className="btn" data-bs-toggle="modal" data-bs-target="#unboost-modal"><LoadingText text="MINTING"/></button>
                    ) : (
                      <button onClick={() => mintB()} className="btn" data-bs-toggle="modal" data-bs-target="#unboost-modal">MINT</button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a className="btn btn-black-disabled" data-bs-toggle="modal" data-bs-target="#deposit-modal">+ DEPOSIT</a>
            <a className="btn btn-black-disabled" data-bs-toggle="modal" data-bs-target="#send-modal">SEND</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;

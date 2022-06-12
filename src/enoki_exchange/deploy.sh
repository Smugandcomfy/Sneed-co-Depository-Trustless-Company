echo "deploying exchange for token pair: $APP_TOKEN_A / $APP_TOKEN_B"
. "$(dirname "$0")"/build.sh
OWNER="principal \"$(
  dfx identity get-principal
)\""

dfx deploy enoki_exchange
dfx canister call enoki_exchange finishInit "(principal \"$APP_TOKEN_A\", principal \"$APP_TOKEN_B\", $PRICE_NUMBER_OF_DECIMALS)"

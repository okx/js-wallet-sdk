#/bin/sh
echo `pwd`

npm install

echo "build crypto-lib"

cd ./packages/crypto-lib  &&   npm install && npm run build && npm link && cd -


echo "build coin-base"
cd ./packages/coin-base  &&   npm link @okxweb3/crypto-lib && npm run build && npm link && cd -


string="coin-aptos,coin-bitcoin,coin-ethereum,coin-near,coin-solana,coin-starknet,coin-cosmos, coin-eos, coin-flow,coin-polkadot,coin-stacks,coin-sui"
array=($(echo $string | tr ',' ' '))
for var in ${array[@]}; do
  echo "build $var"
  cd ./packages/$var && npm link @okxweb3/coin-base @okxweb3/crypto-lib && npm run build && cd -
  echo "build " $var "success.\n\n"
done

echo 'link ethereum'
cd ./packages/coin-ethereum && npm link && cd -

string="coin-tron,coin-zkspace"
array=($(echo $string | tr ',' ' '))
for var in ${array[@]}; do
  echo $var ".\n" "\n"
  cd ./packages/$var && npm link @okxweb3/coin-base @okxweb3/crypto-lib @okxweb3/coin-ethereum && npm run build && cd -
done

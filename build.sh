#/bin/sh
echo `pwd`

npm install

cur=`pwd`

echo "build crypto-lib"

cd $cur/packages/crypto-lib  &&   npm install && npm run build && npm run-script test && npm link && cd -


echo "build coin-base"
cd $cur/packages/coin-base  &&   npm link @okxweb3/crypto-lib && npm run build && npm run-script test && npm link && cd -


string="coin-aptos,coin-bitcoin,coin-ethereum,coin-near,coin-solana,coin-starknet,coin-cosmos, coin-eos, coin-flow,coin-polkadot,coin-stacks,coin-sui"
array=($(echo $string | tr ',' ' '))
for var in ${array[@]}; do
  echo "build $var"
  cd $cur/packages/$var && npm link @okxweb3/coin-base @okxweb3/crypto-lib && npm run build && npm run-script test && cd -
  echo "build " $var "success.\n\n"
done

echo 'link ethereum'
cd $cur/packages/coin-ethereum && npm link && cd -

string="coin-tron,coin-zkspace"
array=($(echo $string | tr ',' ' '))
for var in ${array[@]}; do
  echo $var ".\n" "\n"
  cd $cur/packages/$var && npm link @okxweb3/coin-base @okxweb3/crypto-lib @okxweb3/coin-ethereum && npm run build && npm run-script test && cd -
done

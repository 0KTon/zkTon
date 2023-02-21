# zKTon

An NFT aggregator marketplace built on telegram, built during dorahacks hack-a-tonx[https://dorahacks.io/hackathon/hack-a-tonx/].

To keep it simple - zKTON- the first NFT marketplace aggregator on the TON blockchain.

Liquidity is the single most important thing for a healthy NFT ecosystem and zKTON is bringing that to the fast growing NFT community on TON.

Some of zKTON’s pioneering innovation includes social buying and portfolio management of NFTs as well as zero-knowledge private metadata and advanced trading analytics.

### Hack a Tonx
In this hackathon, we hope to learn and understand the ton ecosystem, understand func. Finally, create an NFT aggregator which can be used to buy an NFT social via telegram.

We presented this idea in IRL at the Tonx meetup's and there was interest from the TON ecosystem. 
Although TON NFT ecosystem is nascent, as more projects build on it we see this growing. 

### User flows
#### Hackathon Main User Workflows: 
#####  UX.1 user flow: 
1. User access Community Telegram Chat 
1. User view the list of commands:
    /list -> to view all the items that can be purchased
    Select OR /start-group-buy <id> -> will create a new channel for group buying that item selected. If item is already partially purchased, we can redirect to the existing channel. 
    Note: if other person already purchase the full amount of selected NFT: allow to withdraw. 
1. Select a NEW item to purchase
1. Automatically access the newly created channel
1. Under GroupBuy Channel, it will show payment method information (which links to ZKBOT private chat) 
1. In ZKBOT private chat, user can specify % to buy 
1. User can do payment 

When 100% of group buy requirement has reached (OR 100% specified): the purchase will be done automatically by our smart contract. 

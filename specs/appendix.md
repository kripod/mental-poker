# Appendix
Made for the "Simple TTP-free Mental Poker protocol" whitepaper written by
Choongmin Lee.

## Introduction
While the referenced document describes the core concepts of setting up a mental
poker protocol, it does not specify how community cards should be dealt, nor
does it cover the behavior of disconnecting parties on the game.

## Dealing community cards
### With P2P connection between the clients
After the public keys used for communication have been exchanged between each
client, but before the initial dealing process, the array of dealers shall be
determined using every public key (in ascending order, concatenated) as a seed.

An array of dealers is required in order to avoid issues caused by disconnection
of clients. The first connected client of the array shall generate the number
`k` to be opened at the start of each turn.

### Using client-server architecture
The server shall generate a public-private key pair and distribute its public
key during the key exchange between clients. After the initial dealing process,
the server must generate an array of `k`s based on its private key, and then
broadcast the result.

As cards can only be dealt if every connected client has sent their secret
corresponding to the `k`(s) of the given round, it shall not be possible for any
of the parties (including the server) to cheat.

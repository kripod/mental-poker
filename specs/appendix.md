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
After the initial dealing process, the server must generate an array of `k`s
at random, and then broadcast the result.

As cards can only be dealt if every connected client has sent their secret
corresponding to the `k`(s) of the given round, it shall not be possible for any
of the parties (including the server) to cheat.

## Handling disconnected users
The initial card deck consists of `CARDS_IN_DECK = 52` cards. There are
`CARDS_ON_TABLE` face-up community cards and each player has `CARDS_IN_HAND`
cards in hand. Given `M` players, `x` of them disconnect and `N = M - x` of them
remain in play.

Firstly, the game's original deck points should be recalculated without taking
the points of disconnected users into account. Secrets of each player must be
regenerated, but the previous secrets shall also be kept to be able to prove
ownership of a hand at the end of the game.

Players must send an encrypted and shuffled deck to each other with the provably
owned card indexes of self and the community removed. This means that every
player sends a deck of `CARDS_IN_DECK - CARDS_IN_HAND - CARDS_ON_TABLE`
(encrypted and shuffled) deck points.

Everyone shall encrypt the already encrypted deck of others using the same
secret for every card, like during the initial shuffling process. The result
should be `N` different arrays of `N`-times encrypted deck points, with
`CARDS_IN_DECK - x * CARDS_IN_HAND - CARDS_ON_TABLE` common elements. Common
points must be kept in ascending order, but the uncommon ones shall be
discarded.

After re-establishing the game, shuffling and locking should happen like they
did during the initial shuffle, but with all the owned card IDs removed from the
deck.

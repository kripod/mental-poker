# Appendix
Made for the "Simple TTP-free Mental Poker protocol" whitepaper written by
Choongmin Lee.

## Introduction
While the referenced document describes the core concepts of setting up a mental
poker protocol, it does not specify how community cards should be dealt, nor
does it cover the behavior of disconnecting parties on a game.

This document provides a guide for eliminating any kind of issues which could
occur during a game. Please be aware that additional problems may exist until
their descriptions are added below.

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

Firstly, the original deck points of the game should be recalculated without
taking the points of disconnected users into account. Secrets of each player
must be regenerated, but the previous secrets shall also be kept to be able to
prove ownership of a hand at the end of the game.

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

## Verifying the validity of exchanged information
During communication, clients may send invalid data to each other:

- Wrongly encrypted decks in the cascaded shuffling or locking phase
- Invalid secrets in the card drawing/opening phase

When using public key cryptography for encrypting data between each other, proof
of invalidity can be presented by revealing the private key of the player who
received wrong data. Other players can approve or dismiss the claim of the
prover. Once a claim gets approved, incorrect parties should be sanctioned by
disconnecting them from the game. False claims, approvals and disapprovals
should also be sanctioned.

### Detecting wrongly encrypted decks
If a player has chosen a hand but cannot decode its cards, then a claim of
invalidity should be submitted by the player, and every player shall broadcast
all of their secrets in order to verify the validity of the claim.

If the claim gets approved, then the game shall be reestablished without the
incorrect parties.

### Detecting invalid secrets
After players have generated their secrets, they shall broadcast an array
containing the hash of each secret.

A newly-received secret should be verified by comparing its hash to the value
generated during the aforementioned process. If the values do not match, then
a claim of invalidity should be submitted by the player along with the private
key, in order to let other players verify the validity of the claim.

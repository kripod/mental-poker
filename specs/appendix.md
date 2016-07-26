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

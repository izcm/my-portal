```solidity
/*
 *	NB: This preview has removed all code comments
 *	See Github Repo for fully commented code + docs
*/
object "MiniNFT" {

  code {
    datacopy(0x00, dataoffset("runtime"), datasize("runtime"))
    return(0x00, datasize("runtime"))
  }

  object "runtime" {
    code {
      require_condition(iszero(callvalue()))

      switch selector()
      case 0x6a627842 {
        mint(decode_as_address(0))
      }
      case 0xa9059cbb {
        transfer(decode_as_address(0), decode_as_uint(1))
      }
      case 0x18160ddd {
        totalSupply()
      }
      case 0x70a08231 {
        balanceOf(decode_as_address(0))
      }
      case 0x6352211e {
        ownerOf(decode_as_uint(0))
      }
      case 0x4cef1007 {
        mintWithColor(decode_as_address(0), decode_as_uint(1))
      }
      case 0x242d81cd {
        setColor(decode_as_uint(0), decode_as_uint(1))
      }
      case 0x23994729 {
        colorOf(decode_as_uint(0))
      }
      case 0x44b285db {
        svg(decode_as_uint(0))
      }
      default {
        revert(0x00, 0x00)
      }

      function mintWithColor(to, rgb24) {
        mint(to)

        let token_id := sload(slot_total_supply())

        setColor(token_id, rgb24)
      }

      function mint(to) {
        if iszero(to) { revert_zero_addr() }

        let supply := sload(slot_total_supply())

        let token_id := add(supply, 1)
        let o_slot := add(slot_owners_base(), token_id)

        sstore(o_slot, to)

        let ptr := mload(0x40)
        mstore(ptr, to)
        mstore(add(ptr, 0x20), slot_balances_base())

        let b_slot := keccak256(ptr, 0x40)
        let b := sload(b_slot)

        let b_new := add(b, 1)
        sstore(b_slot, b_new)

        sstore(slot_total_supply(), token_id)

        mstore(0x00, token_id)

        log3(
          0x00, 0x20,
          0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef,
          0,
          to
        )
      }

      function setColor(token_id, rbg_in) {
        let slot := add(slot_owners_base(), token_id)
        let packed := sload(slot)

        let owner := unpack_owner(packed)
        if iszero(eq(owner, caller())) { revert_not_owner() }

        let rgb24 := and(rbg_in, 0xffffff)
        let rgb24_ls := shl(232, rgb24)

        packed := or(rgb24_ls, owner)
        sstore(slot, packed)
      }

      function colorOf(token_id) {
        if iszero(token_id) { revert_invalid_token() }

        let slot := add(slot_owners_base(), token_id)
        let packed := sload(slot)

        let rgb24 := unpack_rgb(packed)

        mstore(0x00, rgb24)
        return(0x00 , 0x20)
      }

      function transfer(to, token_id) {
        if iszero(token_id) { revert_invalid_token() }
        if iszero(to) { revert_zero_addr() }

        let o_slot := add(slot_owners_base(), token_id)
        let f_packed := sload(o_slot)

        let from := unpack_owner(f_packed)
        if iszero(eq(from, caller())) { revert_not_owner() }

        let msb24_mask := shl(232, 0xffffff)
        let rgb := and(f_packed, msb24_mask)
        let t_packed := or(rgb, to)

        sstore(o_slot, t_packed)

        let ptr := mload(0x40)

        mstore(ptr, to)
        mstore(add(ptr, 0x20), slot_balances_base())

        let b_slot_to := keccak256(ptr, 0x40)
        let b_to_before := sload(b_slot_to)

        let b_to_after := add(b_to_before, 1)
        sstore(b_slot_to, b_to_after)

        mstore(ptr, from)

        let b_slot_from := keccak256(ptr, 0x40)
        let b_from_before := sload(b_slot_from)

        let b_from_after := sub(b_from_before, 1)
        sstore(b_slot_from, b_from_after)

        mstore(0x00, token_id)

        log3(
          0x00, 0x20,
          0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef,
          from,
          to
        )
      }

      function totalSupply() {
        let ts := sload(slot_total_supply())

        mstore(0x00, ts)
        return(0x00, 0x20)
      }

      function ownerOf(token_id){
        if iszero(token_id) { revert_invalid_token() }

        let slot := add(slot_owners_base(), token_id)
        let packed := sload(slot)

        let owner := unpack_owner(packed)
        if iszero(owner) { revert_invalid_token() }

        mstore(0x00, owner)
        return(0x00, 0x20)
      }

      function balanceOf(addr) {
        let ptr := mload(0x40)

        mstore(ptr, addr)
        mstore(add(ptr, 0x20), slot_balances_base())

        let b_slot := keccak256(ptr, 0x40)
        let b := sload(b_slot)

        mstore(0x00, b)
        return(0x00, 0x20)
      }

      function svg(token_id) {
        if iszero(token_id) { revert_invalid_token() }

        let o_slot := add(slot_owners_base(), token_id)
        let packed := sload(o_slot)

        let r := unpack_red(packed)
        let g := unpack_green(packed)
        let b := unpack_blue(packed)

        let rgb_s := 6

        let h := dataoffset("SVG_HEAD")
        let hs := datasize("SVG_HEAD")
        let t := dataoffset("SVG_TAIL")
        let ts := datasize("SVG_TAIL")

        let size := add(add(0x40, hs), add(rgb_s, ts))

        let ptr := mload(0x40)
        mstore(0x40, add(ptr, size))

        mstore(ptr, 0x20)
        mstore(add(ptr, 0x20), add(add(hs, rgb_s), ts))

        let data_ptr := add(ptr, 0x40)

        datacopy(data_ptr, h, hs)

        let colorPtr := add(data_ptr, hs)

        write_byte_as_hex(r, colorPtr)
        write_byte_as_hex(g, add(colorPtr, 2))
        write_byte_as_hex(b, add(colorPtr, 4))

        datacopy(add(add(data_ptr, hs), rgb_s), t, ts)

        return(ptr, size)
      }

      function write_byte_as_hex(v, outPtr) {
          let hi := shr(4, v)
          let lo := and(v, 0x0f)

          mstore8(outPtr, hex_digit(hi))
          mstore8(add(outPtr,1), hex_digit(lo))
      }

      function hex_digit(n) -> c {
        if lt(n, 10) {
            c := add(0x30, n)
        }
        if iszero(lt(n, 10)) {
            c := add(0x61, sub(n, 10))
        }
      }
      function selector() -> s {
        s := shr(224, calldataload(0))
      }

      function decode_as_uint(offset) -> uint {
        let ptr := add(4, mul(offset, 0x20))

        if lt(calldatasize(), add(ptr, 0x20)) {
          revert (0x00, 0x00)
        }

        uint := calldataload(ptr)
      }

      function decode_as_address(offset) -> addr {
        let v := decode_as_uint(offset)

        if shr(160, v) { revert(0x00, 0x00) }

        addr := v
      }
      function pack_rgb(r, g, b) -> rgb {
        let r_ls := shl(16, r)
        let g_ls := shl(8, g)

        rgb :=  or(or(r_ls, g_ls), b)
      }

      function unpack_owner(packed) -> owner {
        let mask := 0xffffffffffffffffffffffffffffffffffffffff
        owner := and(packed, mask)
      }

      function unpack_red(packed) -> r {
        let rgb := unpack_rgb(packed)
        r := shr(16, rgb)
      }

      function unpack_green(packed) -> g {
        let rgb := unpack_rgb(packed)
        g := and(shr(8, rgb), 0xff)
      }

      function unpack_blue(packed) -> b {
        let rgb := unpack_rgb(packed)
        b := and(rgb, 0xff)
      }

      function unpack_rgb(packed) -> rgb {
        rgb := shr(232, packed)
      }
      function slot_total_supply() -> slot {
        slot := 0x00
      }

      function slot_owners_base() -> slot {
        slot := 0x10
      }

      function slot_balances_base() -> slot {
        slot := 0x09
      }

      function require_condition(condition) {
        if iszero(condition) { revert(0x00, 0x00) }
      }
      function revert_not_owner() {
        revert_custom_error(0x30cd7471)
      }

      function revert_invalid_token() {
        revert_custom_error(0xc1ab6dc1)
      }

      function revert_zero_addr() {
        revert_custom_error(0x2e076300)
      }

      function revert_custom_error(sig) {
          mstore(0x00, shl(224,  sig))
          revert(0x00, 0x04)
      }
    }
    data "SVG_HEAD" "<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1600' viewBox='0 0 1200 1200'><defs><path id='P' d='m712.5 581.25c0 10.355-8.3945 18.75-18.75 18.75s-18.75-8.3945-18.75-18.75 8.3945-18.75 18.75-18.75 18.75 8.3945 18.75 18.75z'/></defs><g fill='none' stroke='#"
    data "SVG_TAIL" "' stroke-width='8'><path d='m1031.2 337.5h-675c-4.9727 0-9.7422 1.9766-13.258 5.4922-3.5156 3.5156-5.4922 8.2852-5.4922 13.258v675c0 4.9727 1.9766 9.7422 5.4922 13.258 3.5156 3.5156 8.2852 5.4922 13.258 5.4922h675c4.9727 0 9.7422-1.9766 13.258-5.4922 3.5156-3.5156 5.4922-8.2852 5.4922-13.258v-675c0-4.9727-1....[see github repo for full svg]/></g></svg>"

  }
}
```

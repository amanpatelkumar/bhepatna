    // ===== Order detail checks: flags suspicious names and phone numbers. The order is still sent. =====
    // Shared by the website and the orders script (apps-script/Code.gs is generated from this file by build.mjs).
    function checkOrderDetails(name, phone) {
      const reasons = [];
      const n = String(name || "").trim();
      let digits = String(phone || "").replace(/\D/g, "");
      if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
      if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
      const letters = n.replace(/[^\p{L}]/gu, "");
      const placeholders = ["test", "testing", "abc", "xyz", "xxx", "dummy", "fake", "none", "nil", "null", "na", "nothing", "unknown", "name", "user", "customer", "aaa", "bbb", "ccc", "abcd", "sample", "temp", "asdf", "qwerty"];
      if (/[0-9@#$%^&*_=+<>\[\]{}|\\\/~`]/.test(n)) reasons.push("name has numbers or symbols");
      if (letters.length < 3) reasons.push("name too short");
      else if (!/[\u0900-\u097F]/.test(n)) {
        const low = n.toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
        if (/(.)\1\1/.test(low)) reasons.push("repeated letters");
        if (/(asdf|qwer|zxcv|hjkl|qwe|asd|zxc|sdf|fgh|ghj)/.test(low)) reasons.push("keyboard pattern");
        if (low.split(" ").some(w => placeholders.indexOf(w) >= 0)) reasons.push("placeholder name");
        if (letters.length >= 4 && !/[aeiouy]/.test(low)) reasons.push("no vowels");
      }
      if (digits.length !== 10) reasons.push("phone is not 10 digits");
      else {
        if (!/^[6-9]/.test(digits)) reasons.push("phone is not a mobile number");
        if (/^(\d)\1{9}$/.test(digits)) reasons.push("phone repeats one digit");
        if (["1234567890", "0123456789", "9876543210", "0987654321"].indexOf(digits) >= 0) reasons.push("phone is a pattern");
      }
      return reasons;
    }

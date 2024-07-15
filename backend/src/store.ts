export let userWSIds: Array<any> = [];

export function removeWSId(wsid: string) {
  userWSIds = userWSIds.filter((item) => item.wsid !== wsid);
}

export function removeWSIdByEmail(email: string) {
  userWSIds = userWSIds.filter((item) => item.email !== email);
}

export function isValidWSId(email: string) {
  const users = userWSIds.filter((item) => item.email === email);
  if (users[0]) {
    return true;
  } else {
    return false;
  }
}

export function getWSIdNyEmail(wsid: string) {
  const users = userWSIds.filter((item) => item.wsid === wsid);
  if (users[0]) {
    return users[0];
  } else {
    return null;
  }
}

export function getWSbyId(email: string) {
  const users = userWSIds.filter((item) => item.email === email);
  if (users[0]) {
    return users[0];
  } else {
    return null;
  }
}

export function makeOnline(wsid: string) {
  userWSIds = userWSIds.map((item) =>
    item.wsid === wsid
      ? { email: item.email, name: item.name, wsid: item.wsid, online: true }
      : item
  );
}


export function makeOffline(wsid: string) {
    userWSIds = userWSIds.map((item) =>
      item.wsid === wsid
        ? { email: item.email, name: item.name, wsid: item.wsid, online: false }
        : item
    );
  }


export function getOnline() {
    return userWSIds.filter((item) => item.online === true);
  }
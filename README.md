
## Description
W is a custom typescript first validation library written in typescript inspired from zod and  <a href="https://github.com/WebDevSimplified/custom-zod/tree/main">WebDevSimplified</a>. 
## Built With

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

---

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/jaws-1684/w
   ```
2. Navigate into the project directory
   ```sh
   cd w

   ```
3. Install dependencies
   ```sh
   npm install
   ```
4. Build
```sh
npm run build
```   
5. Link the directory since the library in not published
 ```sh
cd ./project-dir
npm link ../w
 ```

### Run tests
```sh
npm test
```
---
## Examples
``` javascript
import * as w from "./base.ts";
import type { Infer } from "./types/types.index";

const userSchema = w.object({
    username: w.string().min(5).max(10),
    email: w.email()
});

const user = userSchema.parse({
    username: "x",
    email: "x@email.com"
});
// const user: ObjectOutput<{
 // username: WString;
 // email: WEmail;
//}>

type User = Infer<typeof userSchema>;
// type User = {} & {
 // username: string;
 // email: string;
//}
```

## Contributing
If you have some *amazing* improvement ideas *feel free* to contribute.

1. Clone this repo
2. Create your Feature Branch (`git checkout -b feature/my_amazing_feature`)
3. Commit your Changes (`git commit -m 'Add some amazing_feature'`)
4. Push to the Branch (`git push origin feature/amazing_feature`)
5. Open a Pull Request


---

## License

Distributed under the ISC License. See `LICENSE` for more information.

---

## Contact

GitHub: [jaws-1684](https://github.com/jaws-1684)
Project Link: [https://github.com/jaws-1684/w](https://github.com/jaws-1684/w)


---

## Acknowledgments
The following resources proved to be quite helpful:
* [WebDevSimplified](https://github.com/WebDevSimplified/custom-zod/tree/main)
* [Zod](https://github.com/colinhacks/zod)



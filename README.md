# ASP Chef

ASP Chef is a simple, intuitive web app for analysing answer sets without having to deal with complex tools or programming languages.

## Prerequisites

A modern browser!
[Firefox](https://www.mozilla.org/en-US/firefox/new/) is a good choice as it has no restriction on the length of URLs.
Large pipelines may hit the restriction on the URL length due to the way ASP Chef encodes recipes in the URL.

No other software is needed as everything is run on the browser thanks to [SvelteKit](https://kit.svelte.dev/), [clingo-wasm](https://github.com/domoritz/clingo-wasm), and many other Javascript libraries.

## Usage

The UI comprises three vertical panels, namely the __Operations panel__, the __Recipe panel__ and the __I/O panel__.

__ASP Chef__ recipes constitute a pipeline where each step takes in input an array of models and provides in output an array of models;
actually, a model in this context is any valid output of ASP systems, that is, even ground terms can be elements of a model.

The recipe is composed by selecting ingredients from the __Operations panel__ and setting their options in the __Recipe panel__.
Popovers are shown for each operation to provide a minimal explanation on how to use it in a recipe. 

The pipeline starts by splitting the input of the recipe (given in the __I/O panel__) on occurrences of the _reserved_ character `§`.
Each part of the input is parsed and checked to be a valid model.
Upon termination, the output of the last step of the recipe is shown in the __I/O panel__. 

The recipe and its input are encoded in the URL, which can be used to restore the recipe and its input for future usage.
As the list of operations grows, and the operations are extended and modified, it is possible that a previously crafted recipe becomes incompatible with the current deployed version of ASP Chef.
While it is possible that in the future a mechanism to preserve retro-compatibility will be implemented, it must be noted that at the moment the main goal of ASP Chef is to ease the fast prototyping of ASP pipelines rather than their long terming usage. 

## Examples

### Billy the Kid

A problem from the [LP/CP Programming Contest 2019](https://github.com/lpcp-contest/lpcp-contest-2019).
It is described [here](https://github.com/lpcp-contest/lpcp-contest-2019/blob/master/billykid/billykid.md).
An ASP Chef recipe solving the problem and including a graphical representation of intermediate steps can be found
[here](https://asp-chef.alviano.net/#eJzFVm1v2zYQ/iuC+mE2JhqiRPHF2IAB/TC0QNoAy4AETSBQJGULVShPktdlQfbbd6TtyJKzAfO21F8sPnc83stzRz6Gld1s+3D5KeybL3aG54vg8Lu1HkpOofQUIqdQdgrRERRMf7dWNdYa1Rs9w5E3OYaSKZRE6RRKTzemUTaFyCmURXQHveCX876rbN/KX03t4g/vorA1qtoYyN1jWOlwGaZCZIliGvFYF4iQIkZFnDKEs5KnScZYoUQYhc3GtLKvGgtbfnq4vzd9W6ngbd1029Z4uRN24fIx7PpmEy5LWXcmCuVmUz+Ey77dwqJbN18O376E+aY1ulKyB4fC56DAnNoZ/ku5gRTosTjPC9kZSvI8fHqK9tFhFhcp1RwxphJEVEJRYVSMdCpFwamMuVHT6Ixs1Tq4APt1d05ka1Ot1sDOJI4h3dvawN7wcSP7NZDhah4sA0+rq/lT8H2AF7d2J3v3LUi/ceKhulcO8WrBEgU7NTARBePSXn102LvguwC+wOBY13++jw4q70Hh1lY297jzZ6+dg8oCArbb+8K04dJ5L6vOub8PeVcz2eXgYQdngwODUJu/KwmUTK2bfFc37Qz0xvb7zUO9jODKKElQWgoB9cIGcc5jWFJRpoyQEpOTetWQrODycO5ZNdsMu2GqtEaqdeji9UmCL5dv+NuvBibeDa5nqSmJzgh0DmOICJUhbqhEZYxThnGiCsamrjdtH7yVtrFwdv3P/R4Ol1jGJSkwUirmiKSEIUkKjlQmVZnEjItyyvOfbfXL9rzWXdkG8pWPk+Zzc5SPhIpCKZogzDIDg4VwVJSlQkQKyngM3tFk4tKFaVdneTQm3b1r3dEYyLApSqwEElhAbUxKkZCcIJNxRY3KMOH6VcaAb7SL6F2067tnXwEbWna+GPrz4iXNoXmd6n6anGjtcacyTJTr6GaimUfBWDwaAngYAsdz+/+cAVrLgmgKJcooFAvLFHHMCqRVxiRLYHLr4vVmwHgAHN9Bh+lwxHktqNFCFIgSQqENgXFcpRkSJNUxyZQGEk5c/whu3le/n0X7l2+azifD3y9Q6D0LgATN59mlr/2zwsCky8irgHBAcpDbpg/8Pn9pLP8Y9i6CT/gHHAVXd07ydRmTMIkF4RzuChpD2k2JhFAcGc6oLIwgCXmd9l7NLBj0ma3h4Nq137gIRxqqqZt2BoHPx1XxqV7N6sp+9v0YBVurq9bTzmuO2zUKruFWv/G71uBT7fza1ZA6WxPsMAAm8OXhoXAJw+n6aAGvkuMzzrB2M7Z2fWRtFOUuH6vWGDufn9p0SouvzbQ0TWLKBEZp6maTIQqJMjEICMbhvUxlKaaz6cdWbtb/hmGZY5hjTd5KXW07x7nxlbfau/9ss/PsBkl4+M59dgF5MHUNZzzjvfmtfxaCzaNbUyWMlmXJUAxhwSCmKYI3DDxr4hjHWBSMcj5tq7W3/d900xunse8LIPsH9zb+AI/hN6rZ2v7xCpbDrFuA43dPfwJ2x3kg!).

### Buttons and Scissors

A problem from the [LP/CP Programming Contest 2021](https://github.com/lpcp-contest/lpcp-contest-2021/).
It is described [here](https://github.com/lpcp-contest/lpcp-contest-2021/tree/main/problem-2).
An ASP Chef recipe solving the problem and including a graphical representation of intermediate steps can be found 
[here](https://asp-chef.alviano.net/#eJzFWHtv2zYQ/yqs9oeVhvREinp57YDO6YoBLVpMwWBvKQy+lBhzJUOSsWSBv/uOlPxMU7RZ28SAI96Ld7+7o3i+9eblctV6o7887z32aqPmSwOrW2+uvZEXSalZYjKis6IgPJAxSQv4StKEaS55ypn2sFctTS3aeVWCystSVdo4oqU03ujWa9pq6Y0KsWgM9sRyubjxRm29gkVzVf2zeb4y88srcIUFAfaWtdFzJVpwxpvNpGhMzGczMKuqsjUliHkJii9KiihiKEQcviO7DN2SAgG4MSxiFMEntEsrBGLA4yjsuGEvwa2u5Vhz3JqKEHVmQvvx1mvcY2Ky1BgWcsI1F4SLWJGsCCRRIk5UWqTcxPERJu9E3Rg0zv/4Mlh6jjYW0dm9iBh1Vc2Mg13PtvD0yo1ZCvCjqkErf/di/NK6sGoh5wcG1V6AWRqlKecZiWNKCS+KmIgwMkRInpmExhGT0VGAuRG1ukJvwIVF86AgD5JfrxYGlL1m/q/x8xM0Ikj5FFOcnwwvINBFVTf+eEtneGzpctW2VelPCMVTvOFO3DNGE/QzokNwrVx9kAbQoLCNmDd2n84d1wgz0VgImxZ4Zdt8jRzsgGWZEUKHjBglAVjKoXIiRklCeZCGWZFxldwBdmFUi95t9n0YuMudOjR6h5NrJQskPFicvfc7R4s0EZmhCcm0SqDEg4wIeCSyiLWWMkmL7K6j36QCPojrWdOaZePnT/MfmUtqXxWQ8Yvy1jJ9OhzmJ2vL25O3AlbaCuRQAbmtAIzKqu1phHY2NnVjKwUHbot9UifUuERUtR9gp7ZdU1A5XB/zu31ul2Je+9Yk+OJPTv2zp/nkBE/dw/TEOuhCuCgR/G3V8wnOrUYfxk8d+8BlG0hP76D57c+XoHGGniMLDKygI7YqxxsfGvhBVauyvT0boBGCL2fh7Eh9sNUfdAYGzgJG4wF68hyN16AWHIHf2/3197dvMDp/C9YdHJt1F/wTu50FW61aG9twOAXTLiGH4OHpwOGF0RQ9Q9PBsFcZDicDgORjKgP3P3cnwTM02aqcvoZIXt+nMjjQ2WyH0WsXIuyGCJrsmyJfYOrnj5o6qsf8Tj32YG+htQXdA4b7rthpzLD9bMQ6nVNXj497FGYsLRQrOKFpCEehkpxIlcHJGEoWFpGMBVNf74Q5vF+k+28Y4LsDw7f1n1yUJ4/8juCcaxkYQyQVknCjGBEx40RTqlSQ8Ewz+X2OXvd2gOMLwtm+dX2G5WJldusQX9bGlDsCx1Utyss9kQgvV/VysUeJQUncdKV66Zfgd9cpJ9gmYSGkWewTOqXxoFsV1/4EPUU0CKCoixt/2i8gdcjyj7vlHMR6C9jaQLuUn9/nwuGOD3foo/647r3Xo65RjyIYWicX8/Jv/wX+BURWpZ7DVb2FzPRbuOMGmC7cgwgft5yF4NDhvCBxmjLCmSngEmEiokIaRppGKov5UTm/qsXy6v/0dxJBFduUzmqh56vG1vXhQHHZu793S7YtBBxv8zxzGQLKjVksYI8tvTXX7ZYJNvcnAzi2EsUDwpSy97sgITKCQaGQkVRFogrJv8f9ztbC/m2OCV0InYJbkFLCk0DDwGICkgogmIRJGGeO3apqKMKbnV+oqtGL+nL1wSb5IS42YHE2L7W59kahLa5GGaji8vJuycjIBIIqEvIMZk7BBBGJYIQmQWLCQgapDo7cPRdy8aCRc5f3vcuv1EkcCkoCFRh4NamCiIjCNJQwHkuq4ygqvtMJDKXXjz22x3O4KfT3KNfpm0tU1/Zre7xahfNTqzK5/xbizpOtKAPmZ4qGeDL4XFluiZ+Wfew7iInSJNGGQ6I1DPJFDIVmoNqkjEMehTDopMft+sqUdvHwWb6L6mDyBsQ2Hve/xXxidO9iui/w/dhMmvG0IFpFMMGxSBJpYmh8mmYw3ytqJD2K7a37VQB1v99oNO5R+2Y/5OwdwOv1+/V/75i0mg==!).


## Development

### Setup

Checkout the repository and run
```bash
$ npm install             # install dependencies
$ npx playwright install  # for E2E test automation
```

Link `clingo.wasm` as a static file with
```bash
$ mkdir -p static/dist; ln -s ../../node_modules/clingo-wasm/dist/clingo.wasm static/dist/
```

Start the development server on port 5188 with
```bash
$ npm run dev
```

Run E2E tests with one of the following commands:
```bash
$ npm run test                                 # all tests are run headless
$ npm run test tests/test.Something.ts         # tests from a single file
$ npm run test:headed                          # all tests, show the browser
$ npm run test:headed tests/test.Something.ts  # single file, show the browser
```

### Adding new operations

Create a component in `src/lib/operations` and link it in the component `<RecipePanel>`.

The operation must be associated with a unique name.
The file implementing the operation must be named as the operation itself, spaces excluded. 

The operation must define its default options and register itself in the `Recipe` class.
When instantiated as an ingredient, the operation will receive in input an array of models, and it is expected to produce in output an array of models.
If the operation must show something depending on the input it will receive, listeners must be used (see the __Output operation__).

The DOM content of the operation should just instantiate the generic `<Operation>` component with a minimal description to be shown as a _popover_ and the content to show when the operation is added as an ingredient.

To ease test automation it is strongly suggested to add `data-testid` attributes to I/O elements of interest.
To actually test an operation add a file in `tests/test.OperationName.ts` with the relevant testcases.
Again, to ease the testing of combinations of different operations implement a method in `tests/utils.ts` to add the operation as an ingredient with the provided options.  


## Contributors

* [Mario Alviano](https://alviano.net)
* Davide Cirimele
* Luis Angel Rodriguez Reiners
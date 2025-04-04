---
title: TableView和CollectionView多选方案实践
slug: tableview-collectionview-multiple-selection-practice
description: ''
tags:
  - iOS
  - 开发技巧
pubDate: 2021-05-10
category: 技术
---

在业务中，我们经常会遇到 `tableview` 和 `collectionView` 多选的场景。通常的实现方案是在模型中维护一个 `isSelected` 字段，通过该字段来做为 `cell` 是否选中的依据。但如果产品体验要求较高的话，会需要做到类似 iOS 原生的体验，例如相册中的多选，可以通过滑动手势实现 `cell` 的多选，又或者类似系统文件应用，双指滑动进入多选状态。
这些效果真的要自定义，实现起来会比较麻烦，并且效果并没有那么好。系统为我们提供了更好的方案，结合系统的方案以及我们的业务需求，我们可以做到很好的多选体验。


## 步骤


我们以 `collectionView` 为例，来实现我们想要的效果，`tableView` 的实现方案类似。
首先，为了实现多选效果，我们需要结合系统提供的属性和方法，`tableView` 和 `collectionView` 都有以下几个属性。

- isEditing ，是否是编辑状态。
- allowsSelection ，在通常状态下是否可以选中，如果为 false，那么点击之后 `didSelectItemAt` 以及 `didDeselectItemAt` 方法无响应。
- allowsMultipleSelection ，在通常状态下是否可以多选，如果为 false，那么点击一个 `cell` 之后会先调用前一个已选中的 cell 的 `didDeselectItemAt` 方法，再调用 `didSelectItemAt`，如果点击的是已选中的 `cell`，只会调用 `didSelectItemAt`。如果为 true，`allowsSelection` 可以视为 true。
- allowsSelectionDuringEditing ，在编辑状态下是否可以选中，其含义和 `allowsSelection` 类似。
- AllowsMultipleSelectionDuringEditing ，在编辑状态下是否可以多选，其含义和 `allowsMultipleSelection` 类似。
其中 `tableView` 很早就支持了 `isEditing` 属性，在 iOS13 上支持了滑动进入多选状态。`collectionView` 在 iOS13 上支持滑动进入多选状态，在 iOS14 上才支持 `isEditing` 属性，因为 iOS14 之前没有 `AllowsMultipleSelectionDuringEditing`，所以在 iOS14 之前只能使用单指滑动进入多选状态，在 iOS14 之后我们可以双指滑动进入多选状态。
除了以上几个属性，还有两个代理方法，我们都很熟悉：

```plain text
// 如果cell.isSelected == false,点击之后调用
func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        print(#function)
    }

// 如果cell.isSelected == true,点击之后调用
    func collectionView(_ collectionView: UICollectionView, didDeselectItemAt indexPath: IndexPath) {
        print(#function)
    }
```


除此以外还有 `UICollectionViewCell` 以及  `UITableViewCell` 的 `isSelected` 属性。这个属性会被系统多次调用，它也代表着当前 cell 的选中状态，点击 `cell` 也是根据 `isSelected` 属性来判断调用 `didSelectItemAt` 还是 `didDeselectItemAt`。


**根据以上知识，想要使用系统的体验更好的方案，我们可以使** **`cell`** **的** **`isSelected`** **状态和我们数据记录的状态保持同步。
现在我们的需求是使用 collectionView 实现滑动选择多个 item，如果系统支持的话，在双指滑动时进入多选状态，否则单指滑动进入多选。具体可以分为以下几步：**

1. 分两种情况设置 collectionView 的多选属性，在 iOS14 之前，collectionView 没有 `isEditing` 属性，因此我们不使用编辑状态，不支持滑动进入多选。

```plain text
// ViewController

        self.view.addSubview(self.collectionView)
        self.collectionView.allowsSelection = true
        // 在iOS14前collectionView没有editing状态，使用非编辑状态下的多选
        self.collectionView.allowsMultipleSelection = true
        if #available(iOS 14.0, *) {
        // 在iOS14之后，支持isEditing状态下多选，同时关闭allowsMultipleSelection，如果打开allowsMultipleSelection开关的话，在下面我们实现滑动进入多选的时候单指就会进入选择状态，关闭的话只能双指滑动进入选择状态
            self.collectionView.allowsMultipleSelection = false
            self.collectionView.allowsSelectionDuringEditing = true
            self.collectionView.allowsMultipleSelectionDuringEditing = true
        }
        self.collectionView.delegate = self
        self.collectionView.dataSource = self
```

1. 设置 collectionView 代理，当用户意图开启多选交互的时候，打开开关。以下几个方法在iOS13之后才支持。

```plain text
// UICollectionViewDelegate

// 是否允许用户开启多选的交互，allowsMultipleSelection为true的时候单指滑动即可开启，allowsMultipleSelectionDuringEditing为true的时候双指滑动开启
    func collectionView(_ collectionView: UICollectionView, shouldBeginMultipleSelectionInteractionAt indexPath: IndexPath) -> Bool {
        return true
    }

// 开启多选状态之后调用，在这里我们进行界面的调整，例如刷新页面显示选中框，显示全选按钮等
    func collectionView(_ collectionView: UICollectionView, didBeginMultipleSelectionInteractionAt indexPath: IndexPath) {
    // isOpenMultipleSelection是我们自定义的属性，标志当前页面的编辑状态
    self.isOpenMultipleSelection = true
        if #available(iOS 14.0, *) {
	        collectionView.isEditing = true
        }
    collectionView.reloadData()
}

    func collectionViewDidEndMultipleSelectionInteraction(_ collectionView: UICollectionView) {
        print(#function)
    }
```

1. 配置 collectionView 的 cell 和点击处理。Cell 将会根据 isOpenMultipleSelection 判断是否显示选择框。

```plain text
// UICollectionViewDelegate,UICollectionViewDataSource

 func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: AlbumGridCollectionViewCell.reuseIdentifier, for: indexPath) as! AlbumGridCollectionViewCell
        cell.config(item: self.datas[indexPath.row],isEditing: self.isOpenMultipleSelection)
        return cell
    }

    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        print(#function)
        let item = self.datas[indexPath.row]
        // 编辑状态下，改变数据模型的选中状态，和cell的isSelected保持同步
        if self.isOpenMultipleSelection {
            item.isSelect = true
            return
        }
        // 非编辑状态，走正常的点击逻辑
        // do something...
        collectionView.deselectItem(at: indexPath, animated: true)
    }

    func collectionView(_ collectionView: UICollectionView, didDeselectItemAt indexPath: IndexPath) {
        print(#function)
        guard self.isOpenMultipleSelection else { return }
        let item = self.datas[indexPath.row]
        // 编辑状态下，改变数据模型的选中状态，和cell的isSelected保持同步
        item.isSelect = false
    }
```

1. 配置 cell 内的界面刷新，重写 isSelected 属性的 didSet 方法，显示选中和未选中图片。

```plain text
// UICollectionViewCell

    override var isSelected: Bool {
        didSet {
            print(#function)
            if isSelected {
                self.checkImageView.image = UIImage(named: "icon_check")
            }else {
                self.checkImageView.image = UIImage(named: "icon_uncheck")
            }
        }
    }

    func config(item: Item,isEditing: Bool) {
        self.titleLabel.text = item.title
        self.checkImageView.isHidden = !isEditing
        // 需要注意的是，此处不能设置cell.isSelected，因为系统会多次调用从而覆盖掉isSeletced状态，应该在willDisplayCell方法内调用
        // self.isSelected = item.isSelect
    }
```

1. 以上基本实现我们想要的效果，但是如果我们手动刷新 collectionView 时，希望 UICollectionViewCell 的 isSelected 状态能够和我们的数据源的选中状态一致。如果在 cellforrow 方法里面修改 `cell.isSelected` 是无效的，需要在 `collectionView(_ collectionView: UICollectionView, willDisplay cell: UICollectionViewCell, forItemAt indexPath: IndexPath)` 方法中设置才可以。

```plain text
func collectionView(_ collectionView: UICollectionView, willDisplay cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        let item = self.userCollections[indexPath.row]
        cell.isSelected = item.isSelect
    }
```


用以上的方式，即可实现我们想要的效果，并且使用了新系统的特性，可以做到原生的优秀体验。

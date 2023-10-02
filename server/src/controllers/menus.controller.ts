import { Request, Response } from "express";
import Menu, { MenuDocument } from "../models/menus.model";

export const getAllMenus = async (req: Request, res: Response) => {
  try {
    // Find all menu items
    const menuItems: MenuDocument[] = await Menu.find();

    res.status(200).json({ result: menuItems });
  } catch (error) {
    console.error("Error get all menu:", error);
    res.status(500).json({ message: "Error get all menu" });
  }
};

export const createMenu = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    const existingMenu = await Menu.findOne({ title });

    if (existingMenu) {
      res
        .status(400)
        .json({ message: "Menu with the same name already exists" });
    }

    const newMenu: MenuDocument = new Menu({
      title,
    });

    await newMenu.save();

    res
      .status(201)
      .json({ message: "Menu created successfully", menu: newMenu });
  } catch (error) {
    console.error("Error creating menu:", error);
    res.status(500).json({ message: "Error creating menu" });
  }
};

export const updateMenuById = async (req: Request, res: Response) => {
  try {
    const menuId = req.params.id;
    const { title } = req.body;

    const existingMenu: MenuDocument | null = await Menu.findById(menuId);

    if (!existingMenu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    if (title !== existingMenu.title) {
      // If the new name is different, check if it's unique
      const menuWithNewTitle: MenuDocument | null = await Menu.findOne({
        title,
      });

      if (menuWithNewTitle) {
        res
          .status(400)
          .json({ message: "Menu with the same name already exists" });
        return;
      }
    }

    existingMenu.title = title;

    const updateMenu: MenuDocument | null = await existingMenu.save();

    res
      .status(200)
      .json({ message: "Menu updated successfully", menu: updateMenu });
  } catch (error) {
    console.error("Error update menu:", error);
    res.status(500).json({ message: "Error update menu" });
  }
};

export const deleteMenuById = async (req: Request, res: Response) => {
  try {
    const menuId = req.params.id;

    // Find the user by ID and remove it
    const deletedMenu: MenuDocument | null = await Menu.findByIdAndRemove(
      menuId
    );

    if (!deletedMenu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Menu deleted successfully", menu: deletedMenu });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: "Error deleting menu" });
  }
};
